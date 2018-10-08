package no.dcat.portal.query;

import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.annotation.PostConstruct;


public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${elastic.clusterNodes}")
    private String clusterNodes;

    @Value("${elastic.clusterName}")
    private String clusterName;

    @PostConstruct
    void validate(){
        assert clusterNodes != null;
        assert clusterName != null;
    }


    private Elasticsearch5Client elasticsearch;

    public Client getClient() {
        if (elasticsearch == null) {
            initializeElasticsearchTransportClient();
        }
        return elasticsearch==null ? null : elasticsearch.getClient();
    }

    void setClient(Client client) {
        elasticsearch = new Elasticsearch5Client(client);
    }

    public ResponseEntity<String> initializeElasticsearchTransportClient() {
        String jsonError = "{\"error\": \"Query service is not properly initialized. Unable to connect to database (ElasticSearch)\"}";

        logger.debug("elasticsearch: " + clusterNodes);
        if (elasticsearch == null) {
            if (clusterNodes == null) {
                logger.error("Configuration property application.clusterNodes is not initialized. Unable to connect to Elasticsearch");
                return new ResponseEntity<>(jsonError, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName);
        }
        return null;
    }
}
