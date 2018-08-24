package no.acat.harvester;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.model.openapi3.OpenApi;
import no.dcat.shared.*;
import no.dcat.shared.client.referenceData.ReferenceDataClient;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;

import java.io.IOException;
import java.net.URL;
import java.util.*;

public class ApiDocumentBuilder {
    Client elasticsearchClient;
    ReferenceDataClient referenceDataClient;

    public ApiDocumentBuilder(Client elasticsearchClient, ReferenceDataClient referenceDataClient) {
        this.elasticsearchClient = elasticsearchClient;
        this.referenceDataClient = referenceDataClient;
    }

    public ApiDocument create(ApiCatalogRecord apiCatalogRecord) {
        ApiDocument apiDocument = new ApiDocument();
        String openApiUrl = apiCatalogRecord.getOpenApiUrl();

        if (openApiUrl.isEmpty()) {
            throw new IllegalArgumentException("Missing OpenApiUrl");
        }

        apiDocument.setId(lookupOrGenerateId(apiCatalogRecord));
        apiDocument.setUri(openApiUrl);
        apiDocument.setPublisher(createPublisher(apiCatalogRecord));
        apiDocument.setAccessRights(extractAccessRights(apiCatalogRecord));
        apiDocument.setProvenance(extractProvenance(apiCatalogRecord));
        apiDocument.setDatasetReferences(extractDatasetReferences(apiCatalogRecord));
        importFromOpenApi(apiDocument, openApiUrl);
        return apiDocument;
    }

    private String lookupOrGenerateId(ApiCatalogRecord apiCatalogRecord) {
        String id = null;

        String openApiUrl = apiCatalogRecord.getOpenApiUrl();
        SearchResponse response = elasticsearchClient.prepareSearch("acat")
                .setTypes("apispec")
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setQuery(QueryBuilders.termQuery("uri", openApiUrl))
                .get();


        SearchHit[] hits = response.getHits().getHits();
        if (hits.length > 0) {
            id = hits[0].getId();
        }

        return (id == null || id.isEmpty()) ? UUID.randomUUID().toString() : id;
    }

    private static Publisher createPublisher(ApiCatalogRecord apiCatalogRecord) {
        return new Publisher(apiCatalogRecord.getOrgNr());
    }

    private List<SkosCode> extractAccessRights(ApiCatalogRecord apiCatalogRecord) {
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

    private SkosCode extractProvenance(ApiCatalogRecord apiCatalogRecord) {
        String provenanceCode = apiCatalogRecord.getProvenanceCode();
        return referenceDataClient.getCodes("provenancestatement").get(provenanceCode);
    }

    private List<Reference> extractDatasetReferences(ApiCatalogRecord apiCatalogRecord) {
        List<Reference> datasetReferences = new ArrayList();
        SkosCode referenceTypeCode = referenceDataClient.getCodes("referencetypes").get("references");
        List<String> datasetReferenceSources = apiCatalogRecord.getDatasetReferences();
        if(datasetReferenceSources!=null) {
            for (String datasetRefUrl : datasetReferenceSources) {
                if (!datasetRefUrl.isEmpty()) {
                    Reference reference = new Reference(referenceTypeCode, SkosConcept.getInstance(datasetRefUrl));
                    datasetReferences.add(reference);
                }
            }
        }
        return datasetReferences.isEmpty() ? null : datasetReferences;
    }

    private static void importFromOpenApi(ApiDocument apiDocument, String openApiUrl) {
        ObjectMapper mapper = Utils.jsonMapper();
        OpenApi openApi;
        try {
            openApi = mapper.readValue(new URL(openApiUrl), OpenApi.class);
        } catch ( IOException e) {
            throw new IllegalArgumentException("Invalid OpenApi Url");
        }

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

        //todo format

        apiDocument.setOpenApi(openApi);
    }

}
