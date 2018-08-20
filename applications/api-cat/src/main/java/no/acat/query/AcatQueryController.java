package no.acat.query;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import no.acat.model.openapi3.QueryResponse;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class AcatQueryController {
    private static final Logger logger = LoggerFactory.getLogger(AcatQueryController.class);

    private ElasticsearchService elasticsearch;

    @Autowired
    public AcatQueryController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }


    @ApiOperation(value = "Queries the api catalog for api specifications",
            notes = "So far only simple queries is supported", response = ApiDocument.class)
    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = "application/json")
    public QueryResponse search(@ApiParam("the query string") @RequestParam(value = "q", defaultValue = "", required = false) String query) {

        try {
            QueryBuilder search;

            if (query.isEmpty()) {
                search = QueryBuilders.matchAllQuery();
            } else {
                search = QueryBuilders.simpleQueryStringQuery(query);
            }

            SearchResponse response = doQuery("acat", "apispec", search, 0, 50);

            logger.info("hits {}", response.getHits().getTotalHits());

            ObjectMapper mapper = Utils.jsonMapper();
            QueryResponse queryResponse = new QueryResponse();
            queryResponse.setHits(new ArrayList<>());
            queryResponse.setTotal(response.getHits().getTotalHits());

            for (SearchHit hit : response.getHits().getHits()) {
                ApiDocument document = mapper.readValue(hit.getSourceAsString(), ApiDocument.class);
                queryResponse.getHits().add(document);
            }

            return queryResponse;
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }

        return null;

    }

    SearchResponse doQuery(String index, String type, QueryBuilder search, int from, int size) {
        SearchRequestBuilder searchBuilder = elasticsearch.getClient()
                .prepareSearch(index)
                .setTypes(type)
                .setQuery(search)
                .setFrom(from)
                .setSize(size);

        return searchBuilder.execute().actionGet();
    }

}
