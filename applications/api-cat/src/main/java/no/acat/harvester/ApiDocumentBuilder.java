package no.acat.harvester;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.spec.converters.OpenApiV3JsonSpecConverter;
import no.acat.spec.converters.SwaggerJsonSpecConverter;
import no.dcat.client.referencedata.ReferenceDataClient;
import no.dcat.shared.*;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.IOUtils;
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
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class ApiDocumentBuilder {
    private Client elasticsearchClient;
    private ReferenceDataClient referenceDataClient;

    private String searchApiUrl;

    private static final ObjectMapper mapper = Utils.jsonMapper();
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);


    public ApiDocumentBuilder(Client elasticsearchClient, ReferenceDataClient referenceDataClient, String searchApiUrl) {
        this.elasticsearchClient = elasticsearchClient;
        this.referenceDataClient = referenceDataClient;
        this.searchApiUrl = searchApiUrl;
    }

    public ApiDocument create(ApiCatalogRecord apiCatalogRecord) {
        String apiSpecUrl = apiCatalogRecord.getApiSpecUrl();
        OpenAPI openApi;
        String apiSpec;

        try {
            apiSpec = IOUtils.toString(new URL(apiSpecUrl).openStream(), Charsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error downloading api spec from url: " + apiSpecUrl);
        }

        if (OpenApiV3JsonSpecConverter.canConvert(apiSpec)) {
            openApi = OpenApiV3JsonSpecConverter.convert(apiSpec);
        } else if (SwaggerJsonSpecConverter.canConvert(apiSpec)) {
            openApi = SwaggerJsonSpecConverter.convert(apiSpec);
        } else {
            throw new IllegalArgumentException("Unsupported api spec format: " + apiSpecUrl);
        }

        try {
            // todo there is something wrong with the converter and openApi model implementation
            // in some case the serialized version does not unserialize
            String json = mapper.writeValueAsString(openApi);
            mapper.readValue(json, OpenAPI.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error verifying OpenAPI deserialization for: " + apiSpecUrl);
        }

        ApiDocument apiDocument = new ApiDocument().builder()
                .id(lookupOrGenerateId(apiCatalogRecord))
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
        apiDocument.setAccessRights(extractAccessRights(apiCatalogRecord));
        apiDocument.setProvenance(extractProvenance(apiCatalogRecord));
        apiDocument.setDatasetReferences(extractDatasetReferences(apiCatalogRecord));
        apiDocument.setApiDocUrl(apiCatalogRecord.getApiDocUrl());
        apiDocument.setProvenanceSort(createProvenanceSort(apiDocument.getProvenance()));
    }

    String lookupOrGenerateId(ApiCatalogRecord apiCatalogRecord) {
        String id = null;

        String apiSpecUrl = apiCatalogRecord.getApiSpecUrl();
        SearchResponse response = elasticsearchClient.prepareSearch("acat")
                .setTypes("apispec")
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

    List<SkosCode> extractAccessRights(ApiCatalogRecord apiCatalogRecord) {
        Map<String, SkosCode> rightsStatements = referenceDataClient.getCodes("rightsstatement");
        List<String> accessRightCodes = apiCatalogRecord.getAccessRightsCodes();
        List<SkosCode> accessRights = new ArrayList();

        if (accessRightCodes == null) {
            return null;
        }

        for (String accessRightCode : accessRightCodes) {
            SkosCode rightStatement = rightsStatements.get(accessRightCode);
            if (rightStatement != null) {
                accessRights.add(rightStatement);
            }
        }

        return accessRights.isEmpty() ? null : accessRights;
    }

    SkosCode extractProvenance(ApiCatalogRecord apiCatalogRecord) {
        String provenanceCode = apiCatalogRecord.getProvenanceCode();
        return referenceDataClient.getCodes("provenancestatement").get(provenanceCode);
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
                apiDocument.setTitle(new HashMap<>());
                apiDocument.getTitle().put("no", openApi.getInfo().getTitle());
            }

            if (openApi.getInfo().getDescription() != null) {
                apiDocument.setDescription(new HashMap<>());
                apiDocument.getDescription().put("no", openApi.getInfo().getDescription());
            }

            if (openApi.getInfo().getContact() != null) {
                apiDocument.setContactPoint(new ArrayList<>());
                Contact contact = new Contact();
                if (openApi.getInfo().getContact().getEmail() != null) {
                    contact.setEmail(openApi.getInfo().getContact().getEmail());
                }
                if (openApi.getInfo().getContact().getName() != null) {
                    contact.setOrganizationName(openApi.getInfo().getContact().getName());
                }
                if (openApi.getInfo().getContact().getUrl() != null) {
                    contact.setUri(openApi.getInfo().getContact().getUrl());
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


    /**
     * Create string that allows simples string sorting of provenance
     *
     * @param provenanceCode Skos code with provenance value
     */
    String createProvenanceSort(SkosCode provenanceCode) {
        String sortString = "";

        final String provenanceValue = provenanceCode != null ? provenanceCode.getCode() : null;

        if ("NASJONAL".equals(provenanceValue)) {
            sortString = "1NASJONAL";
        } else if ("VEDTAK".equals(provenanceValue)) {
            sortString = "2VEDTAK";
        } else if ("BRUKER".equals(provenanceValue)) {
            sortString = "3BRUKER";
        } else if ("TREDJEPART".equals(provenanceValue)) {
            sortString = "4TREDJEPART";
        } else {
            sortString = "9UKJENT";
        }

        return sortString;
    }

}
