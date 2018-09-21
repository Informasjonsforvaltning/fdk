package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;

import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.harvester.crawler.converters.EnhetsregisterResolver;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Crawler for harvesting and load elasticsearch with publishers.
 */
public class CrawlerPublisherJob implements Runnable {

    private final List<CrawlerResultHandler> handlers;
    private final DcatSource dcatSource;
    private final AdminDataStore adminDataStore;
    private final List<String> validationResult = new ArrayList<>();

    public List<String> getValidationResult() {return validationResult;}

    private final Logger logger = LoggerFactory.getLogger(CrawlerPublisherJob.class);

    protected CrawlerPublisherJob(DcatSource dcatSource,
                         AdminDataStore adminDataStore,
                         CrawlerResultHandler... handlers) {
        this.handlers = Arrays.asList(handlers);
        this.dcatSource = dcatSource;
        this.adminDataStore = adminDataStore;
    }

    /**
     * Create an RDF-format model consisting of the defined dataset.
     * The model is extended with all publisher refered to by the datasets, and all the
     * superior publisher to these.
     * The publisher are extracted and loaded into elastic search into index dcat/publisher.
     *
     */
    @Override
    public void run() {
        logger.debug("loadDataset: {}", dcatSource.getUrl());
        Dataset dataset = RDFDataMgr.loadDataset(dcatSource.getUrl());

        Model modelDataset = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();
        enhetsregisterResolver.resolveModel(modelDataset);

        for (CrawlerResultHandler handler : handlers) {
            handler.process(dcatSource, modelDataset, null);
        }
    }
}
