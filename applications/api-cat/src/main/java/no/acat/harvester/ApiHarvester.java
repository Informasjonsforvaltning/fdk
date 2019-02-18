package no.acat.harvester;

import no.acat.model.ApiDocument;
import no.acat.repository.ApiDocumentRepository;
import no.acat.service.ApiDocumentBuilderService;
import no.acat.service.RegistrationApiClient;
import no.fdk.acat.common.model.ApiRegistrationPublic;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

/*
The purpose of the harvester is to ensure that search index is synchronized to registrations.
 */
@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);
    public int RETRY_COUNT_API_RETRIEVAL = 100;
    private ApiDocumentBuilderService apiDocumentBuilderService;
    private RegistrationApiClient registrationApiClient;
    private ApiDocumentRepository apiDocumentRepository;

    @Autowired
    public ApiHarvester(
        ApiDocumentBuilderService apiDocumentBuilderService,
        RegistrationApiClient registrationApiClient,
        ApiDocumentRepository apiDocumentRepository
    ) {
        this.registrationApiClient = registrationApiClient;
        this.apiDocumentBuilderService = apiDocumentBuilderService;
        this.apiDocumentRepository = apiDocumentRepository;
    }

    public void harvestAll() {

        logger.info("harvestAll");

        List<ApiRegistrationPublic> apiRegistrations = getApiRegistrations();

        int registrationCount = apiRegistrations != null ? apiRegistrations.size() : 0;
        logger.info("Extracted {} api-registrations", registrationCount);

        List<String> idsHarvested = new ArrayList<>();

        Date harvestDate = new Date();

        for (ApiRegistrationPublic apiRegistration : apiRegistrations) {
            String harvestSourceUri = registrationApiClient.getPublicApisUrlBase() + '/' + apiRegistration.getId();
            try {
                logger.debug("Indexing from source uri: {}", harvestSourceUri);
                ApiDocument apiDocument = apiDocumentBuilderService.createFromApiRegistration(apiRegistration, harvestSourceUri, harvestDate);
                apiDocumentRepository.createOrReplaceApiDocument(apiDocument);
                idsHarvested.add(apiDocument.getId());
            } catch (Exception e) {
                logger.warn("Error importing API record. ErrorClass={} message={}", e.getClass().getName(), e.getMessage());
                logger.debug("Error stacktrace", e);
            }
        }
        try {
            List<String> idsToDelete = apiDocumentRepository.getApiDocumentIdsNotHarvested(idsHarvested);
            apiDocumentRepository.deleteApiDocumentByIds(idsToDelete);
        } catch (Exception e) {
            logger.error("Error deleting {}", e.getMessage());
            logger.debug("Error stacktrace", e);
        }
    }

    List<ApiRegistrationPublic> getApiRegistrations() {

        List<ApiRegistrationPublic> result = new ArrayList<>();

        List<ApiRegistrationPublic> apiRegistrationsFromCsv = getApiRegistrationsFromCsv();

        logger.info("Loaded {} registrations from csv", apiRegistrationsFromCsv.size());
        result.addAll(apiRegistrationsFromCsv);

        Collection<ApiRegistrationPublic> apiRegistrationsFromRegistrationApi = registrationApiClient.getPublished();
        if (apiRegistrationsFromRegistrationApi == null) {

            boolean doneOk = false;
            int failCounter = 1;
            while (!doneOk) {
                logger.debug("Got error while trying to get Published API list");
                try {
                    Thread.sleep(1000);
                    apiRegistrationsFromRegistrationApi = registrationApiClient.getPublished();
                    doneOk = apiRegistrationsFromRegistrationApi != null;

                    if (!doneOk) {
                        failCounter++;
                    }

                    if (failCounter > RETRY_COUNT_API_RETRIEVAL) {
                        logger.error("Fatal: API Harvester failed to retrieve published APIs from subsystem, shutting down harvester!");
                        throw new RuntimeException("Failed to load API Registrations after waiting for " + failCounter + " secounds. Terminating");
                    }
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        logger.info("Loaded {} registrations from registration-api", apiRegistrationsFromRegistrationApi.size());
        result.addAll(apiRegistrationsFromRegistrationApi);

        logger.info("Total registrations {}", result.size());

        return result;
    }

    List<ApiRegistrationPublic> getApiRegistrationsFromCsv() {
        List<ApiRegistrationPublic> result = new ArrayList<>();

        org.springframework.core.io.Resource apiCatalogCsvFile = new ClassPathResource("apis.csv");
        Iterable<CSVRecord> records;

        try (Reader input = new BufferedReader(new InputStreamReader(apiCatalogCsvFile.getInputStream()))) {
            records = CSVFormat.EXCEL.withHeader().withDelimiter(';').parse(input);

            for (CSVRecord line : records) {
                ApiRegistrationPublic apiRegistration = new ApiRegistrationPublic();

                apiRegistration.setId(line.get("Id"));
                apiRegistration.setCatalogId(line.get("OrgNr"));
                apiRegistration.setApiSpecUrl(line.get("ApiSpecUrl"));
                apiRegistration.setApiDocUrl(line.get("ApiDocUrl"));
                apiRegistration.setNationalComponent("true".equals(line.get("NationalComponent")));
                Set<String> datasetUris = new HashSet<>(Arrays.asList(line.get("DatasetRefs").split(",")));
                apiRegistration.setDatasetUris(datasetUris);

                result.add(apiRegistration);
            }

            logger.debug("Read {} api catalog records.", result.size());

        } catch (IOException e) {
            logger.error("Could not read api catalog records: {}", e.getMessage());
        }
        return result;
    }


}
