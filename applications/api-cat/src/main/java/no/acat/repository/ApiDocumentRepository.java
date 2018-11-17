package no.acat.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

/*
ApiDocumentRepository is a Repository abstraction over elasticsearch storage implementation
TODO - use spring data elasticsearch instead.
 */
@Service
public class ApiDocumentRepository {
    private ElasticsearchService elasticsearchService;
    private ObjectMapper mapper;

    @Autowired
    public ApiDocumentRepository(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearchService = elasticsearchService;
        this.mapper = mapper;
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
}
