package no.acat.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*
ApiDocumentRepository is a Repository abstraction over elasticsearch storage implementation
TODO - use spring data elasticsearch instead.
 */
@Service
public class ApiDocumentRepository {
    private static Logger logger = LoggerFactory.getLogger(ApiDocumentRepository.class);
    private ElasticsearchService elasticsearchService;
    private ObjectMapper mapper;

    @Autowired
    public ApiDocumentRepository(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearchService = elasticsearchService;
        this.mapper = mapper;
    }

    public long getCount() {
        SearchResponse response = elasticsearchService.getClient()
            .prepareSearch("acat")
            .setTypes("apidocument")
            .setQuery(QueryBuilders.matchAllQuery())
            .setSize(0) // Don't return any documents, we don't need them.
            .get();

        return response.getHits().getTotalHits();
    }

    public Optional<ApiDocument> getById(String id) throws IOException {

        GetResponse getResponse = elasticsearchService.getClient().prepareGet("acat", "apidocument", id).get();

        ApiDocument apiDocument = getResponse.isExists() ? mapper.readValue(getResponse.getSourceAsString(), ApiDocument.class) : null;
        return Optional.ofNullable(apiDocument);
    }

    public Optional<ApiDocument> getApiDocumentByHarvestSourceUri(String harvestSourceUri) {

        SearchResponse response = elasticsearchService.getClient().prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(QueryBuilders.termQuery("harvestSourceUri", harvestSourceUri))
            .get();

        SearchHit[] hits = response.getHits().getHits();
        if (hits.length > 1) {
            throw new RuntimeException("Lookup by harvestSourceUri returned more than one result: " + hits.length);
        }
        if (hits.length == 1) {
            return Optional.ofNullable(new Gson().fromJson(hits[0].getSourceAsString(), ApiDocument.class));
        }

        return Optional.empty();

    }

    public void createOrReplaceApiDocument(ApiDocument document) throws IOException {
        BulkRequestBuilder bulkRequest = elasticsearchService.getClient().prepareBulk();
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

    public void deleteApiDocumentByIds(List<String> ids) {
        if (ids.size() == 0) {
            logger.debug("ApiDocuments deleted. count:0");
            return;
        }

        BulkRequestBuilder bulkRequest = elasticsearchService.getClient().prepareBulk();

        for (String id : ids) {
            DeleteRequest request = new DeleteRequest("acat", "apidocument", id);
            bulkRequest.add(request);
        }

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed delete. Reason %s", bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.debug("ApiDocuments deleted. count:{}", ids.size());
    }

    public List<String> getApiDocumentIdsNotHarvested(List<String> ids) throws IOException {
        logger.debug("harvested ids {}", ids);

        String[] idsArray = ids.toArray(new String[0]);
        QueryBuilder harvestedQuery = QueryBuilders.idsQuery("apidocument").addIds(idsArray);
        logger.trace("getApiDocumentIdsNotHarvested elastic harvestedquery {}", harvestedQuery.toString());

        QueryBuilder notHarvestedQuery = QueryBuilders.boolQuery().mustNot(harvestedQuery);
        logger.trace("getApiDocumentIdsNotHarvested elastic query {}", notHarvestedQuery.toString());

        SearchResponse response = elasticsearchService.getClient().prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(notHarvestedQuery)
            .setFetchSource(new String[]{"id", "harvest.lastHarvested"}, null)
            .get();
        logger.trace("response {}", response);

        SearchHit[] hits = response.getHits().getHits();
        List<String> idsNotHarvested = Arrays.stream(hits).map(hit -> hit.getId()).collect(Collectors.toList());

        logger.debug("Ids not harvested {}", idsNotHarvested);

        return idsNotHarvested;
    }

}
