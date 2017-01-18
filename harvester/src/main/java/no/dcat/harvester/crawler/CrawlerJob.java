package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.DataEnricher;
import no.dcat.harvester.crawler.converters.BrregAgentConverter;
import no.dcat.harvester.validation.DcatValidation;
import no.dcat.harvester.validation.ValidationError;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.DifiMeta;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.graph.Triple;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.system.StreamRDF;
import org.apache.jena.shared.JenaException;
import org.apache.jena.sparql.core.Quad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

public class CrawlerJob implements Runnable {

    private List<CrawlerResultHandler> handlers;
    private DcatSource dcatSource;
    private AdminDataStore adminDataStore;
    private LoadingCache<URL, String> brregCache;
    private List<String> validationResult = new ArrayList<>();
    private List<ValidationError> validationErrors = new ArrayList<>();

    public List<String> getValidationResult() {return validationResult;}

    private final Logger logger = LoggerFactory.getLogger(CrawlerJob.class);

     protected CrawlerJob(DcatSource dcatSource,
                         AdminDataStore adminDataStore,
                         LoadingCache<URL, String> brregCaache,
                         CrawlerResultHandler... handlers) {
        this.handlers = Arrays.asList(handlers);
        this.dcatSource = dcatSource;
        this.adminDataStore = adminDataStore;
        this.brregCache = brregCaache;
    }

    public String getDcatSourceId() {
        return dcatSource.getId();
    }

    @Override
    public void run() {
        logger.info("[crawler_operations] [success] Started crawler job: {}", dcatSource.toString());
        LocalDateTime start = LocalDateTime.now();


        try {
            logger.debug("loadDataset: "+ dcatSource.getUrl());
            Dataset dataset = RDFDataMgr.loadDataset(dcatSource.getUrl());
            Model union = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());
            Iterator<String> stringIterator = dataset.listNames();

            while (stringIterator.hasNext()) {
                union = ModelFactory.createUnion(union, dataset.getNamedModel(stringIterator.next()));
            }
            verifyModelByParsing(union);

            //Enrich model with elements missing according to DCAT-AP-NO 1.1 standard
            DataEnricher enricher = new DataEnricher();
            Model enrichedUnion = enricher.enrichData(union);
            union = enrichedUnion;

            // Checks if publisher is registrered in BRREG Enhetsregistret
            BrregAgentConverter brregAgentConverter = new BrregAgentConverter(brregCache);
            brregAgentConverter.collectFromModel(union);

            // if model is valid run the various handlers process method
            if (isValid(union,validationResult)) {
                logger.debug("[crawler_operations] Valid datasets exists in input data!");

                //TEST: Skriv ut validationresult for å se om innholdet er som forventet
                logger.debug("[crawler_operations] validationResult: " + validationResult.toString());

                //remove non-valid datasets
                removeNonValidDatasets(union);

                for (CrawlerResultHandler handler : handlers) {
                    handler.process(dcatSource, union);
                }
            }

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
        } catch (Exception e) {
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

    /**
     * Checks if a RDF model is valid according to the validation rules that are defined for DCAT.
     *
     * @param model the model to be validated (must be according to DCAT-AP-EU and DCAT-AP-NO
     * @param validationMessage a list of validation messages
     * @return returns true if model is valid (only contains warnings) and false if it has errors
     */
    private boolean isValid(Model model,List<String> validationMessage) {

        //most severe error status
        final ValidationError.RuleSeverity[] status = {ValidationError.RuleSeverity.ok};
        final String[] message = {null};

        validationMessage.clear();  //TODO: cleanup: trengs egentlig validationMessage?
        validationErrors.clear();

        final int[] errors ={0}, warnings ={0}, others ={0};

        boolean validated = DcatValidation.validate(model, (error) -> {
            String msg = "[validation_" + error.getRuleSeverity() + "] " + error.toString() + ", " + this.dcatSource.toString();
            validationMessage.add(msg);
            validationErrors.add(error);

            if (error.isError()) {
                errors[0]++;
                status[0] = error.getRuleSeverity();
                message[0] = error.toString();
                logger.error(msg);
            }
            if (error.isWarning()) {
                warnings[0]++;
                if (status[0] != ValidationError.RuleSeverity.error) {
                    status[0] = error.getRuleSeverity();
                }
                logger.warn(msg);
            } else {
                others[0]++;
                status[0] = error.getRuleSeverity();
                logger.warn(msg);
            }

        });

        String summary = "[validation_summary] " + errors[0] + " errors, "+ warnings[0] + " warnings and " + others[0] + " other messages ";
        validationMessage.add(0, summary);
        logger.info(summary);

        Resource rdfStatus = null;

        switch (status[0]) {
            case error:
                rdfStatus = DifiMeta.error;
                break;
            case warning:
                rdfStatus = DifiMeta.warning;
                break;
            default:
                rdfStatus = DifiMeta.ok;
                break;
        }

        if (adminDataStore != null) adminDataStore.addCrawlResults(dcatSource, rdfStatus, message[0]);

        //check in validation results if any datasets meets minimum criteria
        boolean minimumCriteriaMet = false;
        if (others[0] >= 1 || warnings[0] >= 1) {
            minimumCriteriaMet = true;
        }

        logger.debug("[validation] minimumCriteriaMet: " + minimumCriteriaMet);

        return minimumCriteriaMet;
        //return validated;
    }


    /**
     * Remove non-valida datasets from model
     * Non-valid datasets are those with ruleSeverity=error
     * in global variable validationErrors
     * @param model
     */
    private void removeNonValidDatasets(Model model) {
        //todo: allow specification of ruleseverity to be accepted
        logger.debug("[crawler_operations] Start removing non-valid datasets");

        //Liste over alle Subjekter med feil
        ArrayList<RDFNode> errorSubjects = new ArrayList<RDFNode>();

        //BG: utviklingshjelp. Sjekk om alle ikke-valide datasett er i validationErrors
        for(ValidationError error : validationErrors) {
            if(error.getRuleSeverity() == ValidationError.RuleSeverity.error) {
                logger.debug("[crawler_operations] dataset error: RDF statement: ("
                        + error.getSubject() + ", "
                        + error.getPredicate() + ", "
                        + error.getObject() + ")");

                //Legg subjekt med feil i feilliste
                errorSubjects.add(error.getSubject());
            }
        }

        logger.debug("[crawler_operations] errorSubjects: " + errorSubjects.toString());

        //Find subjects to be removed
        for (RDFNode node : errorSubjects) {
            Resource res = model.getResource( node.toString());
            logger.debug("funnet ressurs: " + res.toString());

            //Slett alle statements der gjeldende datasett er subject eller objekt
            model.removeAll(res, null, null);
            model.removeAll(null, null, res);
            model.write(System.out, "TTL");

            //DETTE SER UT TIL Å FUNKE. TEST MED STØRRE DATASETT I REELL IMPORT.
            //Finn ut hvordan logge infoen til admin, varsle brukere.

        }


    }

    private String returnCrawlDuration(LocalDateTime start, LocalDateTime stop) {
        return String.valueOf(stop.compareTo(start));
    }

}
