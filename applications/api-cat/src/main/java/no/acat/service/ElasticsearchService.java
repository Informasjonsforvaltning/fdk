package no.acat.service;

import no.dcat.datastore.Elasticsearch;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.client.Client;
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

    @PostConstruct
    void validate() {
        assert clusterNodes != null;
        assert clusterName != null;

        initializeElasticsearchTransportClient();
        createIndexIfNotExists();
    }


    private Elasticsearch elasticsearch;

    public Client getClient() {
        if (elasticsearch == null) {
            initializeElasticsearchTransportClient();
        }
        return elasticsearch==null ? null : elasticsearch.getClient();
    }

    private void initializeElasticsearchTransportClient() {
        logger.debug("elasticsearch: " + clusterNodes);
        if (elasticsearch == null) {
            if (clusterNodes == null) {
                logger.error("Configuration property elastic.clusterNodes is not initialized. Unable to connect to Elasticsearch");
            }

            elasticsearch = new Elasticsearch(clusterNodes, clusterName);
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
            Resource apispecMappingResource = new ClassPathResource("apispec.mapping.json");
            String apispecMapping = IOUtils.toString(apispecMappingResource.getInputStream(), "UTF-8");
            getClient().admin().indices().prepareCreate(indexName)
                        .addMapping("apispec", apispecMapping)
                        .execute().actionGet();
        } catch (IOException e) {
            logger.error("Unable to connect to Elasticsearch: {}", e.toString(), e);
        }
    }

}
