package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.DataEnricher;
import no.dcat.harvester.crawler.converters.BrregAgentConverter;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.dcat.harvester.validation.DcatValidation;
import no.dcat.harvester.validation.ValidationError;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.DifiMeta;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.graph.Triple;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.system.StreamRDF;
import org.apache.jena.shared.JenaException;
import org.apache.jena.sparql.core.Quad;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.openrdf.model.vocabulary.DCTERMS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.net.URL;
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


            BrregAgentConverter brregAgentConverter = new BrregAgentConverter(brregCache);
            brregAgentConverter.collectFromModel(union);



            if (isValid(union)) {
                logger.debug("Dataset is valid!");
                for (CrawlerResultHandler handler : handlers) {
                    handler.process(dcatSource, union);
                }
            }

            LocalDateTime stop = LocalDateTime.now();
            logger.info("[crawler_operations] [success] Finished crawler job: {}", dcatSource.toString() + ", Duration=" + returnCrawlDuration(start, stop));


        } catch (JenaException e) {
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
            }catch (Exception e2){}
            adminDataStore.addCrawlResults(dcatSource, DifiMeta.syntaxError, message);
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);

        } catch (HttpException e) {
            adminDataStore.addCrawlResults(dcatSource, DifiMeta.networkError, e.getMessage());
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);
        } catch (Exception e) {
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", dcatSource.toString(), e.toString()),e);
            adminDataStore.addCrawlResults(dcatSource, DifiMeta.error, e.getMessage());
        }

    }

    protected void verifyModelByParsing(Model union) {
        StringWriter str = new StringWriter();
        union.write(str, RDFLanguages.strLangTurtle);
        RDFDataMgr.parse(new StreamRDF() {
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
        }, new ByteArrayInputStream(str.toString().getBytes()), Lang.TTL);

        str = new StringWriter();
        union.write(str, RDFLanguages.strLangRDFXML);
        RDFDataMgr.parse(new StreamRDF() {
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
        }, new ByteArrayInputStream(str.toString().getBytes()), Lang.RDFXML);

    }



    //DEL isEntryscape

    //DEL isVegvesenet


    //DEL enrichForEntryscape

    //DEL enrichForVegvesenet


    //DEL enrichLanguage

    private boolean isValid(Model model) {

        final ValidationError.RuleSeverity[] status = {ValidationError.RuleSeverity.ok};
        final String[] message = {null};

        boolean validated = DcatValidation.validate(model, (error) -> {
            if (error.isError()) {
                status[0] = error.getRuleSeverity();
                message[0] = error.toString();
            }
            if (error.isWarning()) {
                if (status[0] != ValidationError.RuleSeverity.error) {
                    status[0] = error.getRuleSeverity();
                }
            } else {
                status[0] = error.getRuleSeverity();
            }
            logger.error("[validation_" + error.getRuleSeverity() + "] " + error.toString() + ", " + this.dcatSource.toString());
        });

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

        adminDataStore.addCrawlResults(dcatSource, rdfStatus, message[0]);

        return validated;
    }

    private String returnCrawlDuration(LocalDateTime start, LocalDateTime stop) {
        return String.valueOf(stop.compareTo(start));
    }

}
