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

    private ObjectMapper mapper;

    @Autowired
    public ElasticsearchService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    void makeItAllAppear() {
        logger.debug("ElasticService for ACAT: PostConstruct, cluster nodes is {} name is {} ", clusterNodes, clusterName);
        initializeElasticsearchTransportClient();
        try {
            ensureIndexesAndMappingsExists();

        } catch (IOException e) {
            logger.error("Unable to initialize index, mapping and alias", e);
        }
    }

    private void ensureIndexesAndMappingsExists() throws IOException {
        getElasticsearchClient().registerSetting("acat", mapper.readTree(new ClassPathResource("acat.settings.json").getInputStream()).toString());
        getElasticsearchClient().registerMapping("acat", "apidocument", mapper.readTree(new ClassPathResource("apidocument.mapping.json").getInputStream()).get("apidocument").toString());
        getElasticsearchClient().initializeAliasAndIndexMapping("acat");

        getElasticsearchClient().registerSetting("reg-api-catalog", mapper.readTree(new ClassPathResource("reg-api-catalog.settings.json").getInputStream()).toString());
        getElasticsearchClient().registerMapping("reg-api-catalog", "apicatalog", mapper.readTree(new ClassPathResource("apicatalog.mapping.json").getInputStream()).get("apicatalog").toString());
        getElasticsearchClient().initializeAliasAndIndexMapping("reg-api-catalog");
    }


    void setElasticserchCluster(String clusterNodes, String clusterName) {
        assert clusterNodes != null;
        assert clusterName != null;

        this.clusterNodes = clusterNodes;
        this.clusterName = clusterName;

        initializeElasticsearchTransportClient();
        try {
            ensureIndexesAndMappingsExists();


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
