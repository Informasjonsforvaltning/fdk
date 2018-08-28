package no.acat.query;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.model.ApiDocument;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static no.acat.query.ResponseAdapter.convertFromElasticResponse;

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
    public QueryResponse search(
            @ApiParam("the query string")
            @RequestParam(value = "q", defaultValue = "", required = false)
                    String query,

            @ApiParam("Returns datatasets from position x in the result set, 0 is the default value. A value of 150 will return the 150th dataset in the resultset")
            @RequestParam(value = "from", defaultValue = "0", required = false)
                    int from,

            @ApiParam("Specifies the size, i.e. the number of datasets to return in one request. The default is 10, the maximum number of datasets returned is 100")
            @RequestParam(value = "size", defaultValue = "10", required = false)
                    int size
    ) {
        try {
            SearchRequestBuilder searchRequest = buildRequest(query, from, size);
            SearchResponse response = doQuery(searchRequest);
            return convertFromElasticResponse(response);
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }

        return null;
    }

    SearchRequestBuilder buildRequest(String query, int from, int size) {
        QueryBuilder search;

        if (query.isEmpty()) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query);
        }

        return elasticsearch.getClient()
                .prepareSearch("acat")
                .setTypes("apispec")
                .setQuery(search)
                .setFrom(checkAndAdjustFrom(from))
                .setSize(checkAndAdjustSize(size));
    }

    SearchResponse doQuery(SearchRequestBuilder searchBuilder) {
        return searchBuilder.execute().actionGet();
    }

    private int checkAndAdjustFrom(int from) {
        if (from < 0) {
            return 0;
        } else {
            return from;
        }
    }

    private int checkAndAdjustSize(int size) {
        if (size > 100) {
            return 100;
        }

        if (size < 0) {
            return 0;
        }

        return size;
    }

}
