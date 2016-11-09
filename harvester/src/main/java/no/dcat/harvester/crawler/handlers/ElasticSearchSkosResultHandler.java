package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.dcat.harvester.dcat.domain.theme.builders.DataThemeBuilders;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Class for loading skos themes into Elastic-search.
 */
public class ElasticSearchSkosResultHandler implements CrawlerResultHandler {
    private final Logger logger = LoggerFactory.getLogger(ElasticSearchSkosResultHandler.class);
    private final String hostename;
    private final int port;

    public ElasticSearchSkosResultHandler(String hostname, int port) {
        this.hostename = hostname;
        this.port = port;
    }

    @Override
    public void process(DcatSource dcatSource, Model model) {
        logger.trace("Processing results Elasticsearch");

        try (Elasticsearch elasticsearch = new Elasticsearch(hostename, port)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(dcatSource, model, elasticsearch);
        } catch (Exception e) {
            logger.error("Exception: " + e.getMessage(), e);
            throw e;
        }
        logger.trace("finished");
    }

    private void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch) {
        // TODO: shall index be created.
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        List<DataTheme> dataThemes = new DataThemeBuilders(model).build();
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();

        logger.info("Number of theme documents {} for dcat source {}", dataThemes.size(), dcatSource.getId());
        for (DataTheme dataTheme : dataThemes) {

            IndexRequest indexRequest = new IndexRequest("theme", "data-theme", dataTheme.getId());
            indexRequest.source(gson.toJson(dataTheme));

            logger.debug("Add datatheme document {} to bulk request", dataTheme.getId());
            bulkRequest.add(indexRequest);
        }
        BulkResponse bulkResponse = bulkRequest.execute().actionGet();

        if (bulkResponse.hasFailures()) {
            //TODO: process failures by iterating through each bulk response item?
        }
    }
}
