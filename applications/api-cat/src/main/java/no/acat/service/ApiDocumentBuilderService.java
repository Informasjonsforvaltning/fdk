package no.acat.service;

import com.google.common.base.Strings;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import no.acat.model.ApiDocument;
import no.acat.spec.ParseException;
import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.htmlclean.HtmlCleaner;
import no.dcat.shared.Contact;
import no.dcat.shared.DatasetReference;
import no.dcat.shared.Publisher;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;

/*
ApiDocumentBuilder service is enriching api registrations with related data and
denormalizes it for indexing and display purpose in search service
 */
@Service
public class ApiDocumentBuilderService {
    private static final Logger logger = LoggerFactory.getLogger(ApiDocumentBuilderService.class);
    private Client elasticsearchClient;
    private ParserService parserService;

    @Value("${application.searchApiUrl}")
    private String searchApiUrl;

    @Autowired
    public ApiDocumentBuilderService(ElasticsearchService elasticsearchService, ParserService parserService) {
        this.elasticsearchClient = elasticsearchService.getClient();
        this.parserService=parserService;
    }

    public ApiDocument createFromApiRegistration(ApiRegistrationPublic apiRegistration, String harvestSourceUri) throws IOException, ParseException {
        String apiSpecUrl = apiRegistration.getApiSpecUrl();
        String apiSpec = apiRegistration.getApiSpec();

        OpenAPI openApi;
        if (Strings.isNullOrEmpty(apiSpec) && !Strings.isNullOrEmpty(apiSpecUrl)) {
            apiSpec = parserService.getSpecFromUrl(apiSpecUrl);
        }

        openApi = parserService.parse(apiSpec);

        String id = lookupOrGenerateId(harvestSourceUri);

        ApiDocument apiDocument = new ApiDocument().builder()
            .id(id)
            .harvestSourceUri(harvestSourceUri)
            .apiSpecUrl(apiSpecUrl)
            .apiSpec(apiSpec)
            .build();

        populateFromApiRegistration(apiDocument, apiRegistration);
        populateFromOpenApi(apiDocument, openApi);

        logger.info("ApiDocument is created. id={}, harvestSourceUri={}", apiDocument.getId(), apiDocument.getHarvestSourceUri());
        return apiDocument;
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

    String lookupOrGenerateId(String harvestSourceUri) {
        String id = null;

        SearchResponse response = elasticsearchClient.prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(QueryBuilders.termQuery("harvestSourceUri", harvestSourceUri))
            .get();

        SearchHit[] hits = response.getHits().getHits();
        if (hits.length > 0) {
            id = hits[0].getId();
        }

        if (id != null && !id.isEmpty()) {
            logger.info("ApiDocument exists in index, looked up id={}", id);
            return id;
        }

        id = UUID.randomUUID().toString();
        logger.info("ApiDocument does not exist in index, generated id={}", id);
        return id;
    }

    Publisher lookupPublisher(String orgNr) {
        String lookupUri = searchApiUrl + "/publishers/{orgNr}";
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(lookupUri, Publisher.class, orgNr);
        } catch (Exception e) {
            logger.warn("Publisher lookup failed for uri={}. Error: {}", lookupUri, e.getMessage());
        }
        return null;
    }

    DatasetReference lookupDatasetReference(String uri) {
        String lookupUrl = UriComponentsBuilder
            .fromHttpUrl(searchApiUrl)
            .path("/datasets/byuri")
            .queryParam("uri", uri)
            .toUriString();
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(lookupUrl, DatasetReference.class);
        } catch (Exception e) {
            logger.warn("Dataset lookup failed for uri={}. Error: {}", lookupUrl, e.getMessage());
        }
        return null;
    }

    Set<DatasetReference> extractDatasetReferences(ApiRegistrationPublic apiRegistration) {
        Set<DatasetReference> datasetReferences = new HashSet<>();
        List<String> datasetReferenceSources = apiRegistration.getDatasetReferences();
        if (datasetReferenceSources != null) {
            for (String datasetRefUrl : datasetReferenceSources) {
                if (!datasetRefUrl.isEmpty()) {
                    DatasetReference datasetReference = lookupDatasetReference(datasetRefUrl);
                    if (datasetReference != null) {
                        datasetReferences.add(datasetReference);
                    }
                }
            }
        }
        return datasetReferences.isEmpty() ? null : datasetReferences;
    }

    void populateFromOpenApi(ApiDocument apiDocument, OpenAPI openApi) {

        if (openApi == null) {
            return;
        }

        apiDocument.setOpenApi(openApi);

        if (openApi.getInfo() != null) {
            if (openApi.getInfo().getTitle() != null) {
                apiDocument.setTitle(HtmlCleaner.cleanAllHtmlTags(openApi.getInfo().getTitle()));
                apiDocument.setTitleFormatted(HtmlCleaner.clean(openApi.getInfo().getTitle()));
            }

            if (openApi.getInfo().getDescription() != null) {
                apiDocument.setDescription(HtmlCleaner.cleanAllHtmlTags(openApi.getInfo().getDescription()));
                apiDocument.setDescriptionFormatted(HtmlCleaner.clean(openApi.getInfo().getDescription()));
            }

            if (openApi.getInfo().getContact() != null) {
                apiDocument.setContactPoint(new ArrayList<>());
                Contact contact = new Contact();
                if (openApi.getInfo().getContact().getEmail() != null) {
                    contact.setEmail(HtmlCleaner.cleanAllHtmlTags(openApi.getInfo().getContact().getEmail()));
                }
                if (openApi.getInfo().getContact().getName() != null) {
                    contact.setOrganizationName(HtmlCleaner.cleanAllHtmlTags(openApi.getInfo().getContact().getName()));
                }
                if (openApi.getInfo().getContact().getUrl() != null) {
                    contact.setUri(HtmlCleaner.cleanAllHtmlTags(openApi.getInfo().getContact().getUrl()));
                }
                apiDocument.getContactPoint().add(contact);
            }
        }

        apiDocument.setFormats(getFormatsFromOpenApi(openApi));
    }

    Set<String> getFormatsFromOpenApi(OpenAPI openAPI) {
        Set<String> formats = new HashSet<>();
        Paths paths = openAPI.getPaths();
        paths.forEach((path, pathItem) -> {
            List<Operation> operations = pathItem.readOperations();
            operations.forEach((operation -> {
                if (operation == null) return;

                /*as of now, request body formats are not included
                RequestBody requestBody = operation.getRequestBody();
                if (requestBody == null) return;
                Content requestBodyContent = requestBody.getContent();
                if (requestBodyContent==null) return;
                formats.addAll(requestBodyContent.keySet());
                */
                ApiResponses apiResponses = operation.getResponses();
                if (apiResponses == null) return;
                List<ApiResponse> apiResponseList = new ArrayList<>(apiResponses.values());
                apiResponseList.forEach(apiResponse -> {
                    Content responseContent = apiResponse.getContent();
                    if (responseContent == null) return;
                    formats.addAll(responseContent.keySet());
                });
            }));
        });
        return formats;
    }

}
