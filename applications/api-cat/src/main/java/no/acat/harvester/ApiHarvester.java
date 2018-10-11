package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.acat.service.ReferenceDataService;
import no.dcat.client.apiregistration.ApiRegistrationClient;
import no.dcat.client.referencedata.ReferenceDataClient;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private Client elasticsearchClient;
    private ObjectMapper mapper = Utils.jsonMapper();
    private ApiRegistrationClient apiRegistrationClient;

    @Value("${application.searchApiUrl}")
    private String searchApiUrl;


    @Autowired
    public ApiHarvester(ElasticsearchService elasticsearchService) {
        this.elasticsearchClient = elasticsearchService.getClient();
    }

    public List<ApiDocument> harvestAll() throws ParseException {
        List<ApiDocument> result = new ArrayList<>();

        List<ApiCatalogRecord> apiCatalog = getApiCatalog();
        ApiDocumentBuilder apiDocumentBuilder = createApiDocumentBuilder();

        for (ApiCatalogRecord apiCatalogRecord : apiCatalog) {
            try {
                ApiDocument apiDocument = apiDocumentBuilder.create(apiCatalogRecord);
                indexApi(apiDocument);
                result.add(apiDocument);
            } catch (Exception e) {
                logger.error("Error importing API record: {}", e.getMessage());
            }
        }
        JSONObject publishedJson = apiRegistrationClient.getPublished("PUBLISHED");

        Gson gson = new Gson();
        TypeToken<List<ApiDocument>> token = new TypeToken<List<ApiDocument>>() {
        };
        List<ApiDocument> apiDocumentList = gson.fromJson(String.valueOf(publishedJson), token.getType());

        result.removeIf(c -> apiDocumentList.stream()
            .map(ApiDocument::getApiDocUrl)
            .anyMatch(n -> n.equals(c.getApiDocUrl())));

        return Stream.concat(result.stream(), apiDocumentList.stream())
            .collect(Collectors.toList());
    }

    ApiDocumentBuilder createApiDocumentBuilder() {
        return new ApiDocumentBuilder(elasticsearchClient, searchApiUrl);
    }

    void indexApi(ApiDocument document) throws JsonProcessingException {
        BulkRequestBuilder bulkRequest = elasticsearchClient.prepareBulk();
        String id = document.getId();
        IndexRequest request = new IndexRequest("acat", "apidocument", id);

        String json = mapper.writeValueAsString(document);
        request.source(json);
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", id, bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.info("ApiDocument is indexed. id={}, url={}", document.getId(), document.getApiSpecUrl());
    }

    List<ApiCatalogRecord> getApiCatalog() {
        List<ApiCatalogRecord> result = new ArrayList<>();

        org.springframework.core.io.Resource apiCatalogCsvFile = new ClassPathResource("apis.csv");
        Iterable<CSVRecord> records;

        try (
            Reader input =
                new BufferedReader(new InputStreamReader(apiCatalogCsvFile.getInputStream()))
        ) {
            records = CSVFormat.EXCEL.withHeader().withDelimiter(';').parse(input);

            for (CSVRecord line : records) {
                ApiCatalogRecord catalogRecord = new ApiCatalogRecord().builder()
                    .orgNr(line.get("OrgNr"))
                    .apiSpecUrl(line.get("ApiSpecUrl"))
                    .apiDocUrl(line.get("ApiDocUrl"))
                    .nationalComponent("true".equals(line.get("NationalComponent")))
                    .datasetReferences(Arrays.asList(line.get("DatasetRefs").split(",")))
                    .build();

                result.add(catalogRecord);
            }

            logger.info("Read {} api catalog records.", result.size());

        } catch (
            IOException e) {
            logger.error("Could not read api catalog records: {}", e.getMessage());
        }
        return result;
    }


}
