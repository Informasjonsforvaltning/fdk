package no.acat.service;

import io.swagger.v3.oas.models.OpenAPI;
import no.acat.model.ApiDocument;
import no.acat.repository.ApiDocumentRepository;
import no.acat.spec.ParseException;
import no.dcat.client.publishercat.PublisherCatClient;
import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.htmlclean.HtmlCleaner;
import no.dcat.shared.*;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import no.fdk.acat.common.model.apispecification.ExternalDocumentation;
import no.fdk.acat.converters.apispecificationparser.UniversalParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.google.common.base.Strings.isNullOrEmpty;

/*
ApiDocumentBuilder service is enriching api registrations with related data and
denormalizes it for indexing and display purpose in search service
 */
@Service
public class ApiDocumentBuilderService {
    private static final Logger logger = LoggerFactory.getLogger(ApiDocumentBuilderService.class);
    private ApiDocumentRepository apiDocumentRepository;
    private ParserService parserService;
    private PublisherCatClient publisherCatClient;
    private DatasetCatClient datasetCatClient;

    @Autowired
    public ApiDocumentBuilderService(ApiDocumentRepository apiDocumentRepository, ParserService parserService, PublisherCatClient publisherCatClient, DatasetCatClient datasetCatClient) {
        this.apiDocumentRepository = apiDocumentRepository;
        this.parserService = parserService;
        this.publisherCatClient = publisherCatClient;
        this.datasetCatClient = datasetCatClient;
    }

    public ApiDocument createFromApiRegistration(ApiRegistrationPublic apiRegistration, String harvestSourceUri, Date harvestDate) throws IOException, ParseException, no.fdk.acat.converters.apispecificationparser.ParseException {
        String apiSpecUrl = apiRegistration.getApiSpecUrl();
        String apiSpec = getApiSpec(apiRegistration);
        OpenAPI openApi = parserService.parse(apiSpec);
        ApiSpecification apiSpecification = new UniversalParser().parse(apiSpec);

        Optional<ApiDocument> existingApiDocumentOptional = apiDocumentRepository.getApiDocumentByHarvestSourceUri(harvestSourceUri);
        String id = existingApiDocumentOptional.isPresent() ? existingApiDocumentOptional.get().getId() : UUID.randomUUID().toString();

        ApiDocument apiDocument = new ApiDocument().builder()
            .id(id)
            .harvestSourceUri(harvestSourceUri)
            .apiSpecUrl(apiSpecUrl)
            .apiSpec(apiSpec)
            .openApi(openApi)
            .apiSpecification(apiSpecification)
            .build();

        populateFromApiRegistration(apiDocument, apiRegistration);
        populateFromApiSpecification(apiDocument, apiSpecification);
        updateHarvestMetadata(apiDocument, harvestDate, existingApiDocumentOptional.orElse(null));

        logger.info("ApiDocument is created. id={}, harvestSourceUri={}", apiDocument.getId(), apiDocument.getHarvestSourceUri());
        return apiDocument;
    }

    void updateHarvestMetadata(ApiDocument apiDocument, Date harvestDate, ApiDocument existingApiDocument) {
        HarvestMetadata oldHarvest = existingApiDocument != null ? existingApiDocument.getHarvest() : null;

        // new document is not considered a change
        boolean hasChanged = existingApiDocument != null && !isEqualContent(apiDocument, existingApiDocument);

        HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(oldHarvest, harvestDate, hasChanged);

        apiDocument.setHarvest(harvest);
    }

    String getApiSpec(ApiRegistrationPublic apiRegistration) throws IOException {
        String apiSpecUrl = apiRegistration.getApiSpecUrl();
        String apiSpec = apiRegistration.getApiSpec();

        if (isNullOrEmpty(apiSpec) && !isNullOrEmpty(apiSpecUrl)) {
            apiSpec = parserService.getSpecFromUrl(apiSpecUrl);
        }
        return apiSpec;
    }

    boolean isEqualContent(ApiDocument first, ApiDocument second) {
        String[] ignoredProperties = {"id", "harvest", "openApi", "apiSpecification"};
        ApiDocument firstContent = new ApiDocument();
        ApiDocument secondContent = new ApiDocument();

        BeanUtils.copyProperties(first, firstContent, ignoredProperties);
        BeanUtils.copyProperties(second, secondContent, ignoredProperties);

        // This is a poor mans comparator. Seems to include all fields
        String firstString = firstContent.toString();
        String secondString = secondContent.toString();
        return firstString.equals(secondString);
    }

    void populateFromApiRegistration(ApiDocument apiDocument, ApiRegistrationPublic apiRegistration) {
        apiDocument.setPublisher(lookupPublisher(apiRegistration.getCatalogId()));
        apiDocument.setNationalComponent(apiRegistration.isNationalComponent());
        apiDocument.setDatasetReferences(extractDatasetReferences(apiRegistration));
        apiDocument.setApiDocUrl(apiRegistration.getApiDocUrl());
        apiDocument.setCost(apiRegistration.getCost());
        apiDocument.setUsageLimitation(apiRegistration.getUsageLimitation());
        apiDocument.setPerformance(apiRegistration.getPerformance());
        apiDocument.setAvailability(apiRegistration.getAvailability());
    }

    Publisher lookupPublisher(String orgNr) {
        try {
            return publisherCatClient.getByOrgNr(orgNr);
        } catch (Exception e) {
            logger.warn("Publisher lookup failed for orgNr={}. Error: {}", orgNr, e.getMessage());
        }
        return null;
    }

    Set<DatasetReference> extractDatasetReferences(ApiRegistrationPublic apiRegistration) {
        List<String> datasetReferenceSources = apiRegistration.getDatasetReferences();

        if (datasetReferenceSources == null) {
            return null;
        }

        Set<DatasetReference> datasetReferences = datasetReferenceSources.stream()
            .filter(it -> !it.isEmpty())
            .map(datasetRefUrl -> datasetCatClient.lookupDatasetReferenceByUri(datasetRefUrl))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toSet());

        return datasetReferences.isEmpty() ? null : datasetReferences;
    }

    void populateFromApiSpecification(ApiDocument apiDocument, ApiSpecification apiSpecification) {

        if (apiSpecification == null) {
            return;
        }

        if (apiSpecification.getInfo() != null) {
            if (apiSpecification.getInfo().getTitle() != null) {
                apiDocument.setTitle(apiSpecification.getInfo().getTitle());
            }

            if (apiSpecification.getInfo().getDescription() != null) {
                apiDocument.setDescription(HtmlCleaner.cleanAllHtmlTags(apiSpecification.getInfo().getDescription()));
                apiDocument.setDescriptionFormatted(apiSpecification.getInfo().getDescription());
            }

            if (apiSpecification.getInfo().getContact() != null) {
                apiDocument.setContactPoint(new ArrayList<>());
                Contact contact = new Contact();
                if (apiSpecification.getInfo().getContact().getEmail() != null) {
                    contact.setEmail(apiSpecification.getInfo().getContact().getEmail());
                }
                if (apiSpecification.getInfo().getContact().getName() != null) {
                    contact.setOrganizationName(apiSpecification.getInfo().getContact().getName());
                }
                if (apiSpecification.getInfo().getContact().getUrl() != null) {
                    contact.setUri(apiSpecification.getInfo().getContact().getUrl());
                }
                apiDocument.getContactPoint().add(contact);
            }
        }

        if (isNullOrEmpty(apiDocument.getApiDocUrl())) {
            ExternalDocumentation externalDocs = apiSpecification.getExternalDocs();
            if (externalDocs != null) {
                String docUrl = externalDocs.getUrl();
                if (!isNullOrEmpty(docUrl)) {
                    apiDocument.setApiDocUrl(docUrl);
                }
            }
        }

        apiDocument.setFormats(apiSpecification.getFormats());
    }

}
