package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.dcat.domain.theme.builders.CodeBuilders;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.SkosCode;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Handles harvesting of code sources, and saving them into elasticsearch
 */
public class CodeCrawlerHandler extends AbstractCrawlerHandler {
    private final Logger logger = LoggerFactory.getLogger(CodeCrawlerHandler.class);

    public static String CODE_INDEX = "codes";
    public static int MAX_NR_OF_DOCUMENT_TO_DELETE = 100;
    private final String indexType;
    private final boolean reload;

    /**
     * Creates a new elasticsearch result handler connected to
     * a particular elasticsearch instance
     *
     * @param hostname host name where elasticsearch cluster is found
     * @param port port for connection to elasticserach cluster. Usually 9300
     * @param clustername Name of elasticsearch cluster
     */
    public CodeCrawlerHandler(String hostname, int port, String clustername, String indexType, boolean reload) {
        this.hostename = hostname;
        this.port = port;
        this.clustername = clustername;
        this.indexType = indexType;
        this.reload = reload;
    }

    /**
     * Index codes with Elasticsearch
     * @param dcatSource information about the source/provider
     * @param model RDF model containing the data catalog
     * @param elasticsearch The Elasticsearch instance where the data catalog should be stored
     */
    @Override
    protected void indexWithElasticsearch(DcatSource dcatSource, Model model, Elasticsearch elasticsearch) {

        if (reload) {
            logger.debug("Delete all documents in type {}.", indexType);
            elasticsearch.deleteAllDocumentsInType(CODE_INDEX, indexType, MAX_NR_OF_DOCUMENT_TO_DELETE);
        }

        if (!reload && elasticsearch.typeExists(indexType)) {
            logger.debug("Doesn't load type {} because it exists.", indexType);
            return;
        }

        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        List<SkosCode> codes = new CodeBuilders(model).build();
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();

        logger.info("Number of codes {} for code source {}", codes.size());
        for (SkosCode code : codes) {

            IndexRequest indexRequest = new IndexRequest(CODE_INDEX, indexType, code.getCode());
            indexRequest.source(gson.toJson(code));

            logger.debug("Add code {} to bulk request", code.getCode());
            bulkRequest.add(indexRequest);
        }
        BulkResponse bulkResponse = bulkRequest.execute().actionGet();

        if (bulkResponse.hasFailures()) {
            throw new RuntimeException(String.format("Loading of Code feiled with error message: %s", bulkResponse.buildFailureMessage()));
        }
    }
}
