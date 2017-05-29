package no.dcat.harvester.crawler.handlers;

import no.dcat.admin.store.domain.DcatSource;
import no.dcat.data.store.Elasticsearch;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Topclass for Handles of harvesting of data sources, and saving them into elasticsearch
 */
public abstract class AbstractCrawlerHandler implements CrawlerResultHandler {
    private final Logger logger = LoggerFactory.getLogger(AbstractCrawlerHandler.class);

    String hostename;
    int port;
    String clustername;

    /**
     * Process a data catalog, represented as an RDF model
     *
     * @param dcatSource information about the source/provider of the data catalog
     * @param model      RDF model containing the data catalog
     */
    @Override
    public void process(DcatSource dcatSource, Model model) {
        logger.debug("Processing results Elasticsearch: " + this.hostename + ":" + this.port + " cluster: " + this.clustername);

        try (Elasticsearch elasticsearch = new Elasticsearch(hostename, port, clustername)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(dcatSource, model, elasticsearch);
        } catch (Exception e) {
            logger.error("Exception: " + e.getMessage(), e);
            throw e;
        }
        logger.trace("finished");
    }

    /**
     * Index data catalog with Elasticsearch
     *
     * @param dcatSource    information about the source/provider of the data catalog
     * @param model         RDF model containing the data catalog
     * @param elasticsearch The Elasticsearch instance where the data catalog should be stored
     */
    protected abstract void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch);
}
