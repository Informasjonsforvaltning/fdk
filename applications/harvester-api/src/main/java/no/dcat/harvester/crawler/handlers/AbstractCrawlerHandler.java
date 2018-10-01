package no.dcat.harvester.crawler.handlers;

import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.datastore.domain.DcatSource;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Topclass for Handles of harvesting of data sources, and saving them into elasticsearch
 */
public abstract class AbstractCrawlerHandler implements CrawlerResultHandler {
    private final Logger logger = LoggerFactory.getLogger(AbstractCrawlerHandler.class);

    String clusterNodes;
    String clusterName;

    /**
     * Process a data catalog, represented as an RDF model
     *
     * @param dcatSource information about the source/provider of the data catalog
     * @param model      RDF model containing the data catalog
     */
    @Override
    public void process(DcatSource dcatSource, Model model, List<String> validationResults) {
        logger.debug("Processing results Elasticsearch: " + this.clusterNodes + " cluster: " + this.clusterName);

        try (Elasticsearch5Client elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName)) {
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
    protected abstract void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch5Client elasticsearch);
}
