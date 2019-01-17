package no.dcat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ElasticsearchService {

    private ElasticsearchTemplate elasticsearchTemplate;
    private Elasticsearch5Client elasticClient;
    private ObjectMapper mapper;

    @Autowired
    ElasticsearchService(ElasticsearchTemplate elasticsearchTemplate, ObjectMapper mapper) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.mapper = mapper;
        elasticClient = new Elasticsearch5Client(elasticsearchTemplate.getClient());

        try {
            elasticClient.registerMapping("reg-api", "api",
                mapper.readTree(new ClassPathResource("api-mappings.json").getInputStream()).get("api").toString());
            elasticClient.initializeAliasAndIndexMapping("reg-api");


            elasticClient.registerSetting("reg-api-catalog", mapper.readTree(new ClassPathResource("reg-api-catalog.settings.json").getInputStream()).toString());
            elasticClient.registerMapping("reg-api-catalog", "apicatalog", mapper.readTree(new ClassPathResource("apicatalog.mapping.json").getInputStream()).get("apicatalog").toString());
            elasticClient.initializeAliasAndIndexMapping("reg-api-catalog");

            elasticClient.registerSetting("register", mapper.readTree(new ClassPathResource("register.settings.json").getInputStream()).toString());
            elasticClient.registerMapping("register", "dataset", mapper.readTree(new ClassPathResource("register.dataset.mapping.json").getInputStream()).get("dataset").toString());
            elasticClient.registerMapping("register", "catalog", mapper.readTree(new ClassPathResource("register.catalog.mapping.json").getInputStream()).get("catalog").toString());
            elasticClient.initializeAliasAndIndexMapping("register");

        } catch (IOException e) {
            throw new RuntimeException("Unable to intialize elasticsearch index", e);
        }
    }

}
