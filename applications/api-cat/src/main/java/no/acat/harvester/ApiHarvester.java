package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import no.acat.query.ElasticsearchService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private ElasticsearchService elasticsearchService;
    private ObjectMapper mapper = Utils.jsonMapper();

    @Autowired
    public ApiHarvester(ElasticsearchService elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
    }

    public ApiDocument harvestApi(String url) {
        try {

            ApiDocument doc = mapper.readValue(new URL(url), ApiDocument.class);
            indexApi(url, doc);

            return doc;

        } catch (Exception e) {
            logger.error("Unable to harvest api: {}", e.getMessage(), e);
        }

        return null;
    }

    void indexApi(String url, ApiDocument document) throws JsonProcessingException {
        BulkRequestBuilder bulkRequest = elasticsearchService.getClient().prepareBulk();
        IndexRequest request = new IndexRequest("acat", "apispec", url);

        request.source(mapper.writeValueAsString(document));
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", url, bulkResponse.buildFailureMessage());
            logger.error(msg);
            throw new RuntimeException(msg);
        }
    }

    @PostConstruct
    public List<ApiDocument> harvestAll() {
        List<ApiDocument> result = new ArrayList<>();
        String[] apiFiles = {"enhetsreg-static.json", "seres-api.json", "datakatalog-api.json"};

        try {
            for (String apiFileName : apiFiles) {
                ClassPathResource classPathResource = new ClassPathResource(apiFileName);
                result.add(harvestApi(classPathResource.getURL().toString()));
            }
        } catch (Exception e) {
            logger.error("Unable to harvest all: {}", e.getMessage(), e);
        }
        return result;
    }
}
