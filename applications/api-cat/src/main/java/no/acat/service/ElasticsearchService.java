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

    private String clusterNodes;
    private String clusterName;

    private Elasticsearch5Client elasticsearch5Client;

    private ObjectMapper mapper;

    @Autowired
    public ElasticsearchService(
        ObjectMapper mapper,
        @Value("${elastic.clusterNodes}")
            String clusterNodes,

        @Value("${elastic.clusterName}")
            String clusterName
    ) {
        this.mapper = mapper;
        this.clusterName = clusterName;
        this.clusterNodes = clusterNodes;

        assert this.clusterNodes != null;
        assert this.clusterName != null;
    }

    @PostConstruct
    void init() throws IOException {
        logger.debug("ElasticsearchService init()");

        elasticsearch5Client = new Elasticsearch5Client(clusterNodes, clusterName);

        elasticsearch5Client.registerSetting("acat", mapper.readTree(new ClassPathResource("acat.settings.json").getInputStream()).toString());
        elasticsearch5Client.registerMapping("acat", "apidocument", mapper.readTree(new ClassPathResource("apidocument.mapping.json").getInputStream()).get("apidocument").toString());

        elasticsearch5Client.initializeAliasAndIndexMapping("acat");
    }

    public Client getClient() {
        return elasticsearch5Client.getClient();
    }
}
