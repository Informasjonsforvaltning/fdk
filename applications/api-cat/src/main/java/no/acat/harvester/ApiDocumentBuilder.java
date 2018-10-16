package no.acat.harvester;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.spec.ParseException;
import no.acat.spec.Parser;
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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;

public class ApiDocumentBuilder {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);
    private Client elasticsearchClient;
    private String searchApiUrl;


    public ApiDocumentBuilder(Client elasticsearchClient, String searchApiUrl) {
        this.elasticsearchClient = elasticsearchClient;
        this.searchApiUrl = searchApiUrl;
    }

    public ApiDocument create(ApiCatalogRecord apiCatalogRecord) throws IOException, ParseException {
        String apiSpecUrl = apiCatalogRecord.getApiSpecUrl();

        OpenAPI openApi;
        String apiSpec = Parser.getSpecFromUrl(apiSpecUrl);

        openApi = Parser.parse(apiSpec);

        String id = lookupOrGenerateId(apiCatalogRecord);

        ApiDocument apiDocument = new ApiDocument().builder()
            .id(id)
            .apiSpecUrl(apiSpecUrl)
            .apiSpec(apiSpec)
            .build();

        populateFromApiCatalogRecord(apiDocument, apiCatalogRecord);
        populateFromOpenApi(apiDocument, openApi);

        logger.info("ApiDocument is created. id={}, url={}", apiDocument.getId(), apiDocument.getApiSpecUrl());

        return apiDocument;
    }

    void populateFromApiCatalogRecord(ApiDocument apiDocument, ApiCatalogRecord apiCatalogRecord) {
        apiDocument.setPublisher(lookupPublisher(apiCatalogRecord.getOrgNr()));
        apiDocument.setNationalComponent(apiCatalogRecord.isNationalComponent());
        apiDocument.setDatasetReferences(extractDatasetReferences(apiCatalogRecord));
        apiDocument.setApiDocUrl(apiCatalogRecord.getApiDocUrl());
    }

    String lookupOrGenerateId(ApiCatalogRecord apiCatalogRecord) {
        String id = null;

        String apiSpecUrl = apiCatalogRecord.getApiSpecUrl();
        SearchResponse response = elasticsearchClient.prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(QueryBuilders.termQuery("apiSpecUrl", apiSpecUrl))
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

    Set<DatasetReference> extractDatasetReferences(ApiCatalogRecord apiCatalogRecord) {
        Set<DatasetReference> datasetReferences = new HashSet<>();
        List<String> datasetReferenceSources = apiCatalogRecord.getDatasetReferences();
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
