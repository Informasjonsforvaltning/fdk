package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.model.openapi3.OpenApi;
import no.acat.service.ElasticsearchService;
import no.dcat.shared.Contact;
import no.dcat.shared.Publisher;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private ElasticsearchService elasticsearchService;
    private ObjectMapper mapper = Utils.jsonMapper();

    @Autowired
    public ApiHarvester(ElasticsearchService elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
    }

    public ApiDocument harvestApi(ApiCatalogRecord apiCatalogRecord) {
        try {

            String openApiUrl = apiCatalogRecord.getOpenApiUrl();

            ApiDocument apiDocument = new ApiDocument();

            apiDocument.setUri(openApiUrl);
            apiDocument.setPublisher(new Publisher(apiCatalogRecord.getOrgNr()));

            OpenApi openApi = mapper.readValue(new URL(openApiUrl), OpenApi.class);
            populateApiDocumentOpenApi(apiDocument, openApi);

            String id = lookupApiDocumentId(apiCatalogRecord);
            apiDocument.setId(id);

            indexApi(id, apiDocument);

            return apiDocument;

        } catch (Exception e) {
            logger.error("Unable to harvest api: {}", e.getMessage(), e);
        }

        return null;
    }

    String lookupApiDocumentId(ApiCatalogRecord apiCatalogRecord) {
        String openApiUrl = apiCatalogRecord.getOpenApiUrl();
        SearchResponse response = elasticsearchService.getClient().prepareSearch("acat")
                .setTypes("apispec")
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setQuery(QueryBuilders.termQuery("uri", openApiUrl))
                .get();


        SearchHit[] hits = response.getHits().getHits();
        if (hits.length > 0) {
            return hits[0].getId();
        } else {
            return UUID.randomUUID().toString();
        }
    }

    // this populates ApiDocument from openApi spec
    void populateApiDocumentOpenApi(ApiDocument document, OpenApi openApi) {
        if (openApi.getInfo() != null) {
            if (openApi.getInfo().getTitle() != null) {
                document.setTitle(new HashMap<>());
                document.getTitle().put("no", openApi.getInfo().getTitle());
            }

            if (openApi.getInfo().getDescription() != null) {
                document.setDescription(new HashMap<>());
                document.getDescription().put("no", openApi.getInfo().getDescription());
            }

            if (openApi.getInfo().getContact() != null) {
                document.setContactPoint(new ArrayList<>());
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
                document.getContactPoint().add(contact);
            }
        }

        //todo format

        document.setOpenApi(openApi);
    }

    void indexApi(String id, ApiDocument document) throws JsonProcessingException {
        BulkRequestBuilder bulkRequest = elasticsearchService.getClient().prepareBulk();
        IndexRequest request = new IndexRequest("acat", "apispec", id);

        request.source(mapper.writeValueAsString(document));
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", id, bulkResponse.buildFailureMessage());
            logger.error(msg);
            throw new RuntimeException(msg);
        }
    }

    //
    List<ApiCatalogRecord> getApiCatalog() {
        org.springframework.core.io.Resource canonicalNamesFile = new ClassPathResource("apis.csv");
        List<ApiCatalogRecord> result = new ArrayList<>();

        // todo add hardcoded spec files as hardcoded catalog records
        String[] apiFiles = {"enhetsreg-static.json", "seres-api.json"
                // datakatalog comes via table now
//                , "datakatalog-api.json"
        };
        for (String apiFileName : apiFiles) {
            ApiCatalogRecord catalogRecord = new ApiCatalogRecord();
            catalogRecord.setOrgNr("974760673");
            ClassPathResource classPathResource = new ClassPathResource(apiFileName);
            try {
                catalogRecord.setOpenApiUrl(classPathResource.getURL().toString());
            } catch (Exception e) {
                logger.error("Unable get resource url", e.getMessage(), e);
            }
            //            not in use right now
//            catalogRecord.setOrgName();


//            metaRecord={url=classPathResource.getURL()}
//            result.add(harvestApi(metarecord classPathResource.getURL().toString()));
//
        }

        Iterable<CSVRecord> records;
        try (
                Reader input =
                        new BufferedReader(new InputStreamReader(canonicalNamesFile.getInputStream()))
        ) {
            records = CSVFormat.EXCEL.withHeader().withRecordSeparator(';').parse(input);

            for (CSVRecord line : records) {
                ApiCatalogRecord catalogRecord = new ApiCatalogRecord();
                catalogRecord.setOrgNr(line.get("OrgNr"));
//                not in use right now
//                catalogRecord.setOrgName(line.get("OrgName"));
                catalogRecord.setOpenApiUrl(line.get("OpenApiUrl"));

//                todo expand list and lookup codes
//                catalogRecord.setAccessRights(new ArrayList<SkosCode>()[1]{new SkosCode()} line.get("AccessRights"));
//                catalogRecord.setProvenance();
//                todo dataset reference
//                todo lookup publisher data

                result.add(catalogRecord);
            }

            logger.debug("Read {} api catalog records.", result.size());

        } catch (
                IOException e) {
            logger.error("Could not read api catalog records: {}", e.getMessage());
        }
        return result;
    }

    @PostConstruct
    public List<ApiDocument> harvestAll() {
        List<ApiDocument> result = new ArrayList<>();

        List<ApiCatalogRecord> apiCatalog = getApiCatalog();

        for (ApiCatalogRecord apiCatalogRecord : apiCatalog) {
            result.add(harvestApi(apiCatalogRecord));
        }
        return result;
    }
}
