package no.acat.query;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class AcatQueryController {
    private static final Logger logger = LoggerFactory.getLogger(AcatQueryController.class);

    public static final String MISSING = "MISSING";

    private ElasticsearchService elasticsearch;

    @Autowired
    public AcatQueryController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }


    @ApiOperation(value = "Queries the api catalog for api specifications",
            notes = "So far only simple queries is supported", response = QueryResponse.class)
    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = "application/json")
    public QueryResponse search(
            @ApiParam("the query string")
            @RequestParam(value = "q", defaultValue = "", required = false)
                    String query,

            @ApiParam("Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC ")
            @RequestParam(value = "accessrights", defaultValue = "", required = false)
                    String accessRights,

            @ApiParam("Returns datatasets from position x in the result set, 0 is the default value. A value of 150 will return the 150th dataset in the resultset")
            @RequestParam(value = "from", defaultValue = "0", required = false)
                    int from,

            @ApiParam("Specifies the size, i.e. the number of datasets to return in one request. The default is 10, the maximum number of datasets returned is 100")
            @RequestParam(value = "size", defaultValue = "10", required = false)
                    int size
    ) {
        try {
            SearchRequestBuilder searchRequest = buildSearchRequest(query, accessRights, from, size);
            SearchResponse elasticResponse = doQuery(searchRequest);
            return convertFromElasticResponse(elasticResponse);
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }

        return null;
    }

    @ApiOperation(value = "Get a specific api", response = ApiDocument.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ApiDocument getApiDocument(@PathVariable String id) {
        logger.info("request for {}", id);

        GetResponse response = elasticsearch.getClient().prepareGet("acat", "apispec", id).get();
        ObjectMapper mapper = Utils.jsonMapper();
        try {
            ApiDocument apiDocument = mapper.readValue(response.getSourceAsString(), ApiDocument.class);
            return apiDocument;
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }
        return null;
    }

    QueryResponse convertFromElasticResponse(SearchResponse elasticResponse) {
        return ResponseAdapter.convertFromElasticResponse(elasticResponse);
    }

    SearchRequestBuilder buildSearchRequest(String query, String accessRights, int from, int size) {

        QueryBuilder search;

        if (query.isEmpty()) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query);
        }

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(search);

        if (!StringUtils.isEmpty(accessRights)) {
            BoolQueryBuilder accessRightsFilter = QueryBuilders.boolQuery();
            if (accessRights.equals(MISSING)) {
                accessRightsFilter.mustNot(QueryBuilders.existsQuery("accessRights"));
            } else {
                accessRightsFilter.must(QueryBuilders.termQuery("accessRights.code", accessRights));
            }

            boolQuery.filter(accessRightsFilter);
        }

        return elasticsearch.getClient()
                .prepareSearch("acat")
                .setTypes("apispec")
                .setQuery(boolQuery)
                .setFrom(checkAndAdjustFrom(from))
                .setSize(checkAndAdjustSize(size))
                .addAggregation(createTermsAggregation("accessRights", "accessRights.code"));
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

    private AggregationBuilder createTermsAggregation(String aggregationName, String field) {
        return AggregationBuilders
                .terms(aggregationName)
                .missing(MISSING)
                .field(field)
                .size(10000)
                .order(Terms.Order.count(false));
    }
}
