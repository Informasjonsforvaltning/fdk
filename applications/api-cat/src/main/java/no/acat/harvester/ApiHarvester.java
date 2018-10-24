package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.acat.service.ApiDocumentBuilderService;
import no.acat.service.ElasticsearchService;
import no.acat.service.RegistrationApiService;
import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.client.registrationapi.RegistrationApiClient;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/*
The purpose of the harvester is to ensure that search index is synchronized to registrations.
 */
@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private Client elasticsearchClient;
    private ApiDocumentBuilderService apiDocumentBuilderService;
    private RegistrationApiClient registrationApiClient;
    private ObjectMapper mapper;

    @Autowired
    public ApiHarvester(ObjectMapper mapper, ElasticsearchService elasticsearchService, ApiDocumentBuilderService apiDocumentBuilderService, RegistrationApiService registrationApiService) {
        this.mapper = mapper;
        this.elasticsearchClient = elasticsearchService.getClient();
        this.registrationApiClient = registrationApiService.getClient();
        this.apiDocumentBuilderService = apiDocumentBuilderService;
    }

    public List<ApiDocument> harvestAll() {

        logger.info("harvestAll");

        List<ApiDocument> result = new ArrayList<>();

        List<ApiRegistrationPublic> apiRegistrations = getApiRegistrations();
        int registrationCount = apiRegistrations != null ? apiRegistrations.size() : 0;
        logger.info("Extracted {} api-registrations", registrationCount);

        for (ApiRegistrationPublic apiRegistration : apiRegistrations) {
            String harvestSourceUri = registrationApiClient.getPublicApisUrlBase() + '/' + apiRegistration.getId();
            try {
                logger.debug("Indexing from source uri: {}", harvestSourceUri);
                ApiDocument apiDocument = apiDocumentBuilderService.createFromApiRegistration(apiRegistration, harvestSourceUri);
                indexApi(apiDocument);
                result.add(apiDocument);
            } catch (Exception e) {
                logger.error("Error importing API record. ErrorClass={} message={}", e.getClass().getName(), e.getMessage());
                logger.debug("Error stacktrace", e);

            }
        }
        return result;
    }

    void indexApi(ApiDocument document) throws JsonProcessingException {
        BulkRequestBuilder bulkRequest = elasticsearchClient.prepareBulk();
        String id = document.getId();
        IndexRequest request = new IndexRequest("acat", "apidocument", id);

        String json = mapper.writeValueAsString(document);
        logger.trace("Indexing document source: {}", json);
        request.source(json);
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", id, bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.info("ApiDocument is indexed. id={}, harvestSourceUri={}", document.getId(), document.getHarvestSourceUri());
    }

    List<ApiRegistrationPublic> getApiRegistrations() {
        List<ApiRegistrationPublic> apiRegistrationsFromCsv = getApiRegistrationsFromCsv();
        logger.info("Loaded registrations from csv {}", apiRegistrationsFromCsv.size());

        Collection<ApiRegistrationPublic> apiRegistrationsFromRegistrationApi = registrationApiClient.getPublished();
        logger.info("Loaded registrations from registration-api {}", apiRegistrationsFromRegistrationApi.size());

        // concatenate lists
        List<ApiRegistrationPublic> result = new ArrayList<>();
        result.addAll(apiRegistrationsFromCsv);
        result.addAll(apiRegistrationsFromRegistrationApi);
        logger.info("Total registrations {}", result.size());

        return result;
    }

    List<ApiRegistrationPublic> getApiRegistrationsFromCsv() {
        List<ApiRegistrationPublic> result = new ArrayList<>();

        org.springframework.core.io.Resource apiCatalogCsvFile = new ClassPathResource("apis.csv");
        Iterable<CSVRecord> records;

        try (
            Reader input =
                new BufferedReader(new InputStreamReader(apiCatalogCsvFile.getInputStream()))
        ) {
            records = CSVFormat.EXCEL.withHeader().withDelimiter(';').parse(input);

            for (CSVRecord line : records) {
                ApiRegistrationPublic apiRegistration = new ApiRegistrationPublic();

                apiRegistration.setId(line.get("Id"));
                apiRegistration.setCatalogId(line.get("OrgNr"));
                apiRegistration.setApiSpecUrl(line.get("ApiSpecUrl"));
                apiRegistration.setApiDocUrl(line.get("ApiDocUrl"));
                apiRegistration.setNationalComponent("true".equals(line.get("NationalComponent")));
                List<String> datasetReferences = Arrays.asList(line.get("DatasetRefs").split(","));
                apiRegistration.setDatasetReferences(datasetReferences);

                result.add(apiRegistration);
            }

            logger.debug("Read {} api catalog records.", result.size());

        } catch (
            IOException e) {
            logger.error("Could not read api catalog records: {}", e.getMessage());
        }
        return result;
    }


}
