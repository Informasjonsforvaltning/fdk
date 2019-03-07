package no.fdk.searchapi.service;

import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${elastic.clusterNodes}")
    private String clusterNodes;

    @Value("${elastic.clusterName}")
    private String clusterName;

    private Elasticsearch5Client elasticsearch5Client;

    @PostConstruct
    void init() {
        assert clusterNodes != null;
        assert clusterName != null;

        logger.debug("ElasticsearchService init()");

        elasticsearch5Client = new Elasticsearch5Client(clusterNodes, clusterName);

    }

    public Client getClient() {
        return elasticsearch5Client.getClient();
    }

}
