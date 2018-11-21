package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${elastic.clusterNodes}")
    private String clusterNodes;

    @Value("${elastic.clusterName}")
    private String clusterName;
    private Elasticsearch5Client elasticsearch;

    private ObjectMapper mapper;

    @Autowired
    public ElasticsearchService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    void setElasticserchCluster(String clusterNodes, String clusterName) {
        assert clusterNodes != null;
        assert clusterName != null;

        this.clusterNodes = clusterNodes;
        this.clusterName = clusterName;

        initializeElasticsearchTransportClient();
        try {
            getElasticsearchClient().registerSetting("acat", mapper.readTree(new ClassPathResource("acat.settings.json").getInputStream()).toString());
            getElasticsearchClient().registerMapping("acat", "apidocument", mapper.readTree(new ClassPathResource("apidocument.mapping.json").getInputStream()).get("apidocument").toString());

            getElasticsearchClient().initializeAliasAndIndexMapping("acat");

        } catch (IOException e) {
            logger.error("Unable to initialize index, mapping and alias", e);
        }

    }


    public Elasticsearch5Client getElasticsearchClient() {
        return elasticsearch;
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
}
