package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.harvester.DataEnricher;
import no.dcat.harvester.DatasetSortRankingCreator;
import no.dcat.harvester.crawler.converters.EnhetsregisterResolver;
import no.dcat.harvester.service.SubjectCrawler;
import no.dcat.harvester.validation.DcatValidation;
import no.dcat.harvester.validation.ImportStatus;
import no.dcat.harvester.validation.ValidationError;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.DifiMeta;
import no.dcat.datastore.domain.dcat.vocabulary.DCATCrawler;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.graph.Triple;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.system.StreamRDF;
import org.apache.jena.shared.JenaException;
import org.apache.jena.sparql.core.Quad;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


public class CrawlerJob implements Runnable {


    private List<CrawlerResultHandler> handlers;
    private DcatSource dcatSource;
    private AdminDataStore adminDataStore;
    private List<String> validationResult = new ArrayList<>();

    private Map<RDFNode, ImportStatus> nonValidDatasets = new HashMap<>();
    private List<String> datasetsInError = new ArrayList<>();

    private StringBuilder crawlerResultMessage;
    private Resource rdfStatus;
    private SubjectCrawler subjectCrawler;

    public List<String> getValidationResult() {return validationResult;}
    private Set<String> illegalUris = new HashSet<>();
    private boolean test = false;
    private Model model = null;

    private final Logger logger = LoggerFactory.getLogger(CrawlerJob.class);

    protected CrawlerJob(DcatSource dcatSource,
                         AdminDataStore adminDataStore,
                         SubjectCrawler subjectCrawler,
                         CrawlerResultHandler... handlers) {
        this.handlers = Arrays.asList(handlers);
        this.dcatSource = dcatSource;
        this.adminDataStore = adminDataStore;
        this.subjectCrawler = subjectCrawler;
    }

    public String getDcatSourceId() {
        return dcatSource.getId();
    }

    public List<String> getDatasetsInError() {
        return datasetsInError;
    }

    void testMode() {
        test = true;
    }

    Model getModel() {
        return model;
    }

    public List<String> getTotalDatasets(Model model) {
        List<String> result = new ArrayList<>();

        ResIterator datasetIterator = model.listResourcesWithProperty(RDF.type, DCAT.Dataset);
        while (datasetIterator.hasNext()) {
            Resource datasetResource = datasetIterator.next();
            result.add(datasetResource.getURI());

        }

        return result;
    }

    public Set<String> getOrphanedDatasetUris(Model model) {
        Set<String> orphans = new HashSet<>();

        orphans.addAll(getTotalDatasets(model));
        
        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);

        while(catalogIterator.hasNext()) {
            Resource catalogResource = catalogIterator.next();

            StmtIterator datasetIterator = catalogResource.listProperties(DCAT.dataset);
            while (datasetIterator.hasNext()) {
                Statement datasetStatement = datasetIterator.next();
                Resource datasetResource = datasetStatement.getObject().asResource();
                if (datasetResource.hasProperty(RDF.type, DCAT.Dataset)) {

                    orphans.remove(datasetResource.getURI());
                }
            }
        }

        return orphans;
    }


    @Override
    public void run() {
        logger.info("Started crawler job: {}", dcatSource.toString());
        LocalDateTime start = LocalDateTime.now();

        try {
            Model union = prepareModelForValidation();

            // if model is valid run the various handlers process method
            //TODO: Refaktorering. Nå er det et salig rot av lokale og globale variabler, parametre....
            if (isValid(union)) {
                logger.info("Total number of datasets to harvest: {}", getTotalDatasets(union).size());
                logger.info("{} datasets have syntax problems", nonValidDatasets.size());

                removeNonValidDatasets(union);
                Set<String> orphanedDatasets = getOrphanedDatasetUris(union);

                logger.warn("{} datasets were in error and are not imported: {}", datasetsInError.size(), datasetsInError);
                logger.warn("{} datasets were orphaned (have no catalog) and are not imported: {}", orphanedDatasets.size(), orphanedDatasets);

                crawlerResultMessage.append(removeNonResolvableLocations(union));

                //add sort ranking to datasets
                DatasetSortRankingCreator rankingCreator = new DatasetSortRankingCreator();
                Model rankedUnion = rankingCreator.rankDatasets(union, dcatSource.getUrl());
                model = rankedUnion;

                for (CrawlerResultHandler handler : handlers) {
                    handler.process(dcatSource, rankedUnion, validationResult);
                }
            }

            //Write info about crawl results to store
            String crawlerResultStr = crawlerResultMessage.toString();
            if (adminDataStore != null) adminDataStore.addCrawlResults(dcatSource, rdfStatus, crawlerResultStr);

            LocalDateTime stop = LocalDateTime.now();
            logger.info("[crawler_operations] [success] Finished crawler job: {}", dcatSource.toString() + ", Duration=" + returnCrawlDuration(start, stop));

        } catch (JenaException e) {
            String message = formatJenaException(e);
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(dcatSource, DifiMeta.syntaxError, message);
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);

        } catch (HttpException e) {
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(dcatSource, DifiMeta.networkError, e.getMessage());
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);
        } catch (Throwable e) {
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(dcatSource, DifiMeta.error, e.getMessage());
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);
        }

    }

    protected static String formatJenaException(JenaException e) {
        String message = e.getMessage();

        try {
            if (message.contains("[line: ")) {
                String[] split = message.split("]");
                split[0] = "";
                message = Arrays.stream(split)
                    .map(i -> i.toString())
                    .collect(Collectors.joining("]"));
                message = message.substring(1, message.length()).trim();
            }
        } catch (Exception e2){}
        return message;
    }


    void verifyModelByParsing(Model union) {
        StringWriter str = new StringWriter();

        // writes and parses RDF turtle
        union.write(str, RDFLanguages.strLangTurtle);
        RDFDataMgr.parse(new MyStreamRDF(), new ByteArrayInputStream(str.toString().getBytes(StandardCharsets.UTF_8)), Lang.TTL);

        str = new StringWriter();

        // writes and parses RDF XML
        union.write(str, RDFLanguages.strLangRDFXML);
        RDFDataMgr.parse(new MyStreamRDF(), new ByteArrayInputStream(str.toString().getBytes(StandardCharsets.UTF_8)), Lang.RDFXML);
    }


    /**
     * Do necessary preparations in model before it can be validated
     * - enrichement of missing values
     * - validation of publisher
     *
     * @return enriched model
     */
    Model prepareModelForValidation() throws MalformedURLException {
        logger.debug("loadDataset: "+ dcatSource.getUrl());
        URL url = new URL(dcatSource.getUrl());
        if (url.getProtocol().equals("http") || url.getProtocol().equals("https") || test) {

            return loadModelAndValidate(url);

        }else{
            throw new MalformedURLException("Protocol not supported");
        }
    }

    Model loadModelAndValidate(URL url) {

        Dataset dataset = RDFDataMgr.loadDataset(url.toString());
        Model union = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());
        Iterator<String> stringIterator = dataset.listNames();

        while (stringIterator.hasNext()) {
            union = ModelFactory.createUnion(union, dataset.getNamedModel(stringIterator.next()));
        }

        // remember the base url
        Resource o = ResourceFactory.createResource(url.toString());
        union.add(DCATCrawler.ImportResource, DCATCrawler.source_url, o);

        verifyModelByParsing(union);

        //Enrich model with elements missing according to DCAT-AP-NO 1.1 standard
        DataEnricher enricher = new DataEnricher();
        union = enricher.enrichData(union);

        // Checks subjects and resolve definitions
        if (subjectCrawler != null) {
            union = subjectCrawler.annotateSubjects(union);
        } else {
            logger.warn("Could not annotate subjects. Reason subject crawler is not initialized!");
        }

        // Checks publisher and resolve according to registrered in BRREG Enhetsregistret
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();
        return enhetsregisterResolver.resolveModel(union);
    }


    /**
     * Needed in RDFDataMgr for parsing.
     */
    static class MyStreamRDF implements StreamRDF {
        @Override
        public void start() {

        }

        @Override
        public void triple(Triple triple) {

        }

        @Override
        public void quad(Quad quad) {

        }

        @Override
        public void base(String base) {

        }

        @Override
        public void prefix(String prefix, String iri) {

        }

        @Override
        public void finish() {

        }
    }

    String formatValidationMessage(ValidationError error) {

        String subject = "";
        if (error.getSubject() != null ) {
            if (error.getSubject().isURIResource()) {
                String subjectUri = error.getSubject().asResource().getURI();
                if (subjectUri.startsWith("http")) {
                    subject = " <" + subjectUri  + ">";
                } else if (subjectUri.startsWith("file")){
                    subject = " <" + lastPath(subjectUri) +">";
                } else {
                    subject = " " + subjectUri + "";
                }
            }
        }

        String msg = "[" + error.getRuleSeverity() + "] " + error.getClassName() +  subject + ". Rule " + error.getRuleId() + ": " + error.getRuleDescription();
        //String oldmsg = "[validation_" + error.getRuleSeverity() + "] " + error.toString() + ", " + this.dcatSource.toString();
        return msg;
    }

    String lastPath(String path) {
        if (path != null && path.contains("/")) {
            return path.substring(path.lastIndexOf("/")+1, path.length());
        }

        return path;
    }

    /**
     * Checks if a RDF model is valid according to the validation rules that are defined for DCAT.
     *
     * @param model the model to be validated (must be according to DCAT-AP-EU and DCAT-AP-NO
     * @return returns true if model is valid (only contains warnings) and false if it has errors
     */
    boolean isValid(Model model) {

        //most severe error status
        final ValidationError.RuleSeverity[] status = {ValidationError.RuleSeverity.ok};
        final String[] message = {null};

        validationResult.clear();  //TODO: cleanup: trengs egentlig validationMessage/validationResult?
//        validationErrors.clear();
        nonValidDatasets.clear();

        final int[] errors ={0}, warnings ={0}, others ={0};

        DcatValidation.validate(model, (error) -> {
            String msg = formatValidationMessage(error);

            validationResult.add(msg);
//            validationErrors.add(error);

            //add validation status per dataset for non-valid datasets
            if("Dataset".equals(error.getClassName())) {
                registerValidationStatusForDataset(error);
            }

            if (error.isError()) {
                errors[0]++;
                status[0] = error.getRuleSeverity();
                message[0] = error.toString();
                logger.error(msg);
            } else if (error.isWarning()) {
                warnings[0]++;
                if (status[0] != ValidationError.RuleSeverity.error) {
                    status[0] = error.getRuleSeverity();
                }
                logger.warn(msg);
            } else {
                others[0]++;
                status[0] = error.getRuleSeverity();
                logger.debug(msg);
            }

        });

        String summary = "[validation_summary] " + errors[0] + " errors, "+ warnings[0] + " warnings and " + others[0] + " other messages ";
        validationResult.add(0, summary);
        logger.info(summary);

        //check in validation results if any datasets meets minimum criteria
        boolean minimumCriteriaMet = false;
        if (others[0] >= 1 || warnings[0] >= 1) {
            minimumCriteriaMet = true;
        }

        logger.debug("[validation] Is minimum criteria for importing model met: " + minimumCriteriaMet);

        rdfStatus = createCrawlerStatusForAdmin(status, minimumCriteriaMet);
        crawlerResultMessage = createDatasetSummaryMessage();

        //Prepend summary message before detailed error message
        if (message[0] != null) {
            crawlerResultMessage.append(message[0]);
        }

        return minimumCriteriaMet;
    }


    /**
     * Remove non-valida datasets from model
     * Non-valid datasets are those with ruleSeverity=error
     * in global variable validationErrors
     * @param model the model containing the resources to be removed
     */
    int removeNonValidDatasets(Model model) {

        int counter = 0;

        for(Map.Entry<RDFNode, ImportStatus> entry : nonValidDatasets.entrySet()) {
            ImportStatus is = entry.getValue();
            if(!is.shouldBeImported) {
                counter++;

                datasetsInError.add(entry.getKey().toString());

                Resource res = model.getResource( entry.getKey().toString());
                //Remove triples where dataset is subject or object from model
                model.removeAll(res, null, null);
                model.removeAll(null, null, res);
            }
        }

        return counter;
    }

    boolean locationUriResponds(String locUri) throws IOException {
        URL locUrl = new URL(locUri);
        HttpURLConnection locConnection = (HttpURLConnection) locUrl.openConnection();
        locConnection.setRequestMethod("HEAD");

        return locConnection.getResponseCode() >= 200 && locConnection.getResponseCode() < 400;
    }

    /**
     * Remove triples containing DCTerms.spatial URLs that cannot be resolved
     *
     * @param model the model
     */
    private String removeNonResolvableLocations(Model model) {
        StringBuilder resultMsg = new StringBuilder();
        ResIterator locIter = model.listSubjectsWithProperty(DCTerms.spatial);
        while (locIter.hasNext()) {
            Resource resource = locIter.next();

            String locUri = resource.getPropertyResourceValue(DCTerms.spatial).getURI();

            if (locUri != null && locUri.startsWith("file://")) { // hack to remove fuseki file namespace on locations.
                locUri = lastPath(locUri);
            }

            try {
                if (!illegalUris.contains(locUri)) {

                    if (!locationUriResponds(locUri)) {
                        //Remove non-resolvable location from dataset
                        resultMsg.append(String.format("Dataset %s has non-resolvable property DCTerms.spatial: %s", resource.toString(), locUri));
                        resultMsg.append("\n");
                        model.removeAll(resource, DCTerms.spatial, null);
                        logger.warn("DCTerms.spatial URI cannot be resolved. Location removed form dataset: {}", locUri);
                        illegalUris.add(locUri);
                    }
                }
            } catch (ClassCastException | IOException e) {
                logger.error("Location URL not valid: {}. Reason {}", locUri, e.getLocalizedMessage());
                illegalUris.add(locUri);
            }

        }
        return resultMsg.toString();
    }


    private String returnCrawlDuration(LocalDateTime start, LocalDateTime stop) {
        return String.valueOf(stop.compareTo(start));
    }

    /**
     * Return the most severe validation result in list of non-valid dataset
     * Severity order from most to least severe: error, warning, ok
     * @return ValidationError.RuleSeverity
     */
    private ValidationError.RuleSeverity findMostSevereValidationResult() {
        ValidationError.RuleSeverity mostSevereResult = ValidationError.RuleSeverity.ok;
        for(Map.Entry<RDFNode, ImportStatus> entry : nonValidDatasets.entrySet()) {
            ImportStatus is = entry.getValue();
            switch (is.mostSevereValidationResult) {
                case error:
                    mostSevereResult = is.mostSevereValidationResult;
                    break;
                case warning:
                    if (mostSevereResult == ValidationError.RuleSeverity.error){
                        break;
                    } else {
                        mostSevereResult = is.mostSevereValidationResult;
                        break;
                    }
                case ok:
                    break;
            }
        }
        return mostSevereResult;
    }


    /**
     * Prepare status summary message for non valid datasets, if any exists
     * The message contains a list of datasets IDs that will not be imported
     * due to validation failure.
     * The message is created from contents of global variable nonValidDatasetUris
     *
     * @return String containing validation summary message
     */
    private StringBuilder createDatasetSummaryMessage() {
        //Prepare status summary message for non valid datasets, if any exists
        StringBuilder datasetSummary = new StringBuilder();
        if (nonValidDatasets.size() > 0) {
            if (findMostSevereValidationResult() == ValidationError.RuleSeverity.error){
                datasetSummary.append("Non-valid datasets not imported:\n");
                for(Map.Entry<RDFNode, ImportStatus> entry : nonValidDatasets.entrySet()) {
                    if(!entry.getValue().shouldBeImported) {
                        datasetSummary.append("   " + entry.getKey().toString() + "\n");
                    }
                }
                datasetSummary.append("\nDetails:\n");
            } else {
                datasetSummary.append("All datasets imported (some with warnings)\n\n");
            }
        } else {
            datasetSummary.append("Datasets imported\n\n");
        }
        return datasetSummary;
    }


    /**
     * Helper method to update the validation status per dataset.
     * The individua errors are per validation rule, and there are
     * many rules for each dataset.
     * This method creates an overall status based on all rules applied
     * to one dtaset.
     *
     * @param error a reported validation error
     */
    private void registerValidationStatusForDataset(ValidationError error) {
        ImportStatus is = new ImportStatus();
        is.className = error.getClassName();
        is.mostSevereValidationResult = error.getRuleSeverity();
        if(error.getRuleSeverity() == ValidationError.RuleSeverity.error) {
            is.shouldBeImported = false;
        } else {
            is.shouldBeImported = true;
        }

        RDFNode errorSubject = error.getSubject();
        if (errorSubject != null) {
            if (!nonValidDatasets.containsKey(errorSubject)) {
                nonValidDatasets.put(errorSubject, is);
            } else {
                if (nonValidDatasets.get(errorSubject).mostSevereValidationResult == ValidationError.RuleSeverity.warning) {
                    //if the preexisting most severe error level is warning, we must put the new one
                    //in case it is higher severity (error). Otherwise we skip, as it is already at highest severity.
                    nonValidDatasets.put(errorSubject, is);
                }
            }
        } else {
            logger.info("Couldn't find subject for error: {}", formatValidationMessage(error));
        }
    }


    /**
     * Create the status value of the crawl to be stored in Admin data store
     *
     * @param status Array of status values reported from DcatValidation
     * @param minimumCriteriaMet Boolean value. True if one or more datasets meets minimum validation criteria
     * @return RDF Resource containing DifiMeta status (error, warning or ok)
     */
    private Resource createCrawlerStatusForAdmin(ValidationError.RuleSeverity[] status, boolean minimumCriteriaMet){
       Resource rdfStatusResult;
        switch (status[0]) {
            case error:
                if (minimumCriteriaMet) {
                    //if at least one dataset is valid, set status to warning
                    //even if validation results contains errors for other datasets
                    rdfStatusResult = DifiMeta.warning;
                } else {
                    rdfStatusResult = DifiMeta.error;
                }
                break;
            case warning:
                rdfStatusResult = DifiMeta.warning;
                break;
            default:
                rdfStatusResult = DifiMeta.ok;
                break;
        }
        return rdfStatusResult;
    }

}
