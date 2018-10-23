package no.acat.service;

import com.google.gson.Gson;
import no.acat.model.ApiDocument;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${elastic.clusterNodes}")
    private String clusterNodes;

    @Value("${elastic.clusterName}")
    private String clusterName;
    private Elasticsearch5Client elasticsearch;

    @PostConstruct
    void validate() {
        assert clusterNodes != null;
        assert clusterName != null;

        initializeElasticsearchTransportClient();
        createIndexIfNotExists();
    }

    public Client getClient() {
        if (elasticsearch == null) {
            initializeElasticsearchTransportClient();
        }
        return elasticsearch == null ? null : elasticsearch.getClient();
    }

    private void initializeElasticsearchTransportClient() {
        logger.debug("elasticsearch: " + clusterNodes);
        if (elasticsearch == null) {
            if (clusterNodes == null) {
                logger.error("Configuration property elastic.clusterNodes is not initialized. Unable to connect to Elasticsearch");
            }

            elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName);
        }
    }

    public boolean indexExists(String index) {
        return getClient().admin().indices().prepareExists(index).execute().actionGet().isExists();
    }

    public void createIndexIfNotExists() {
        final String indexName = "acat";
        if (indexExists(indexName)) {
            logger.info("Index exists: " + indexName);
            return;
        }
        logger.info("Creating index: " + indexName);

        try {
            Resource apiDocumentMappingResource = new ClassPathResource("apidocument.mapping.json");
            Resource settingsResource = new ClassPathResource("acat.settings.json");

            String apiDocumentMapping = IOUtils.toString(apiDocumentMappingResource.getInputStream(), "UTF-8");
            String indexSettings = IOUtils.toString(settingsResource.getInputStream(), "UTF-8");
            getClient().admin().indices().prepareCreate(indexName)
                .setSettings(indexSettings)
                .addMapping("apidocument", apiDocumentMapping)
                .execute().actionGet();
        } catch (IOException e) {
            logger.error("Unable to connect to Elasticsearch: {}", e.toString(), e);
        }
    }


    public ApiDocument getApiDocumentByHarvestSourceUri(String harvestSourceUri) {

        SearchResponse response = getClient().prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(QueryBuilders.termQuery("harvestSourceUri", harvestSourceUri))
            .get();

        SearchHit[] hits = response.getHits().getHits();
        if (hits.length == 1) {
            return  new Gson().fromJson(hits[0].getSourceAsString(), ApiDocument.class);
        } else if (hits.length > 1) {
            throw new RuntimeException("Lookup by harvestSourceUri returned more than one result: " + hits.length);
        }

        return null;
    }


}
