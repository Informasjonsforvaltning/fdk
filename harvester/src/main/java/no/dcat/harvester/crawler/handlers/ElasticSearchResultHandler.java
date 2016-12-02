package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.harvester.crawler.client.RetrieveDataThemes;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.difi.dcat.datastore.domain.dcat.Dataset;
import no.difi.dcat.datastore.domain.dcat.Distribution;
import no.difi.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DistributionBuilder;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class ElasticSearchResultHandler implements CrawlerResultHandler {

    public static String DCAT_INDEX = "dcat";
    public static String DISTRIBUTION_TYPE = "distribution";
    public static String DATASET_TYPE = "dataset";
    private final Logger logger = LoggerFactory.getLogger(ElasticSearchResultHandler.class);

    String hostename;
    int port;
    String clustername;

    public ElasticSearchResultHandler(String hostname, int port, String clustername) {
        this.hostename = hostname;
        this.port = port;
        this.clustername = clustername;
    }


    @Override
    public void process(DcatSource dcatSource, Model model) {
        logger.trace("Processing results Elasticsearch");

        try (Elasticsearch elasticsearch = new Elasticsearch(hostename, port, clustername)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(dcatSource, model, elasticsearch);
        } catch (Exception e) {
            logger.error("Exception: " + e.getMessage(), e);
            throw e;
        }
        logger.trace("finished");


    }

    protected void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch) {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();

        logger.debug("Creating index: " + DCAT_INDEX);
        if (!elasticsearch.indexExists(DCAT_INDEX)) {
            elasticsearch.createIndex(DCAT_INDEX);
        }
        logger.debug("Preparing bulkRequest");
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        Map<String, DataTheme> dataThemes = new RetrieveDataThemes(elasticsearch).getAllDataThemes();

        List<Distribution> distributions = new DistributionBuilder(model).build(dataThemes);
        logger.info("Number of distribution documents {} for dcat source {}", distributions.size(), dcatSource.getId());
        for (Distribution distribution : distributions) {
            String json = gson.toJson(distribution);

            IndexRequest indexRequest = new IndexRequest(DCAT_INDEX, DISTRIBUTION_TYPE, distribution.getId());
            indexRequest.source(gson.toJson(distribution));

            logger.debug("Add distribution document {} to bulk request", distribution.getId());
            bulkRequest.add(indexRequest);
        }

        List<Dataset> datasets = new DatasetBuilder(model).build(dataThemes);
        logger.info("Number of distribution documents {} for dcat source {}", datasets.size(), dcatSource.getId());
        for (Dataset dataset : datasets) {
            String json = gson.toJson(dataset);

            IndexRequest indexRequest = new IndexRequest(DCAT_INDEX, DATASET_TYPE, dataset.getId());
            indexRequest.source(gson.toJson(dataset));

            logger.debug("Add dataset document {} to bulk request", dataset.getId());
            bulkRequest.add(indexRequest);
        }

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            //TODO: process failures by iterating through each bulk response item?
        }
    }

}
