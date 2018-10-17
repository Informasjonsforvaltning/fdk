package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.dcat.client.apiregistration.ApiRegistrationClient;
import no.dcat.shared.HarvestMetadata;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.xml.parsers.DocumentBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private Client elasticsearchClient;
    private ObjectMapper mapper = Utils.jsonMapper();
    private ApiRegistrationClient apiRegistrationClient;
    private ElasticsearchService elasticsearchService;

    @Value("${application.searchApiUrl}")
    private String searchApiUrl;


    @Autowired
    public ApiHarvester(ElasticsearchService elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
        this.elasticsearchClient = elasticsearchService.getClient();
    }

    public List<ApiDocument> harvestAll() throws ParseException {
        List<ApiDocument> result = new ArrayList<>();

        List<ApiCatalogRecord> apiCatalog = getApiCatalog();
        ApiDocumentBuilder apiDocumentBuilder = createApiDocumentBuilder();

        for (ApiCatalogRecord apiCatalogRecord : apiCatalog) {
            try {
                ApiDocument apiDocument = apiDocumentBuilder.create(apiCatalogRecord);
                result.add(apiDocument);
            } catch (Exception e) {
                logger.error("Error importing API record: {}", e.getMessage());
            }
        }

        List<ApiDocument> registeredDocuments = getRegisteredApis();

        result.removeIf(c -> registeredDocuments.stream()
            .map(ApiDocument::getApiDocUrl)
            .anyMatch(n -> n.equals(c.getApiDocUrl())));

        List<ApiDocument> mergedApis = Stream.concat(result.stream(), registeredDocuments.stream())
            .collect(Collectors.toList());

        indexApis(mergedApis);

        return mergedApis;
    }

    List<ApiDocument> getRegisteredApis() {

        //JSONObject publishedJson = apiRegistrationClient.getPublished("PUBLISHED");
        return Arrays.asList();

    }

    ApiDocumentBuilder createApiDocumentBuilder() {
        return new ApiDocumentBuilder(elasticsearchClient, searchApiUrl);
    }

    void indexApis(List<ApiDocument> documents) {
        BulkRequestBuilder bulkRequest = elasticsearchClient.prepareBulk();

        documents.forEach( document -> {

            try {
                ApiDocument existingDocument = elasticsearchService.getApiDcoumentBySpecUrl(document.getId());

                if (existingDocument != null) {
                    document.setId(existingDocument.getId());

                } else {
                    // create uuuid and
                    document.setId(UUID.randomUUID().toString());
                    document.setHarvest(new HarvestMetadata());
                    document.getHarvest().setFirstHarvested(new Date());
                }

                document.getHarvest().setLastChanged(new Date());


                IndexRequest request = new IndexRequest("acat", "apidocument", document.getId());

                String json = mapper.writeValueAsString(document);
                request.source(json);

                bulkRequest.add(request);

            } catch (JsonProcessingException jpe) {

            }

        });

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed bulked indexing. Reason %s", bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.info("Indexed {} api documents", documents.size());
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
