package no.acat.restapi;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
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
public class SearchController {
    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    public static final String MISSING = "MISSING";
    public static final int MAX_AGGREGATIONS = 10000;

    private ElasticsearchService elasticsearch;

    @Autowired
    public SearchController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }


    @ApiOperation(value = "Queries the api catalog for api specifications",
            notes = "So far only simple queries is supported", response = QueryResponse.class)
    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = "application/json")
    public QueryResponse search(
            @ApiParam("the query string")
            @RequestParam(value = "q", defaultValue = "", required = false)
                    String query,

            @ApiParam("Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC")
            @RequestParam(value = "accessrights", defaultValue = "", required = false)
                    String accessRights,

            @ApiParam("Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238")
            @RequestParam(value = "orgPath", defaultValue = "", required = false) String orgPath,

            @ApiParam("Filters on format")
            @RequestParam(value = "format", defaultValue = "", required = false)
                    String format,

            @ApiParam("Returns datatasets from position x in the result set, 0 is the default value. A value of 150 will return the 150th dataset in the resultset")
            @RequestParam(value = "from", defaultValue = "0", required = false)
                    int from,

            @ApiParam("Specifies the size, i.e. the number of datasets to return in one request. The default is 10, the maximum number of datasets returned is 100")
            @RequestParam(value = "size", defaultValue = "10", required = false)
                    int size
    ) {
        try {
            SearchRequestBuilder searchRequest = buildSearchRequest(query, accessRights, orgPath, format, from, size);
            SearchResponse elasticResponse = doQuery(searchRequest);
            return convertFromElasticResponse(elasticResponse);
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }

        return null;
    }

    QueryResponse convertFromElasticResponse(SearchResponse elasticResponse) {
        return SearchResponseAdapter.convertFromElasticResponse(elasticResponse);
    }

    SearchRequestBuilder buildSearchRequest(String query, String accessRights, String orgPath, String format, int from, int size) {

        QueryBuilder search;

        if (query.isEmpty()) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query);
        }

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery().must(search);

        addTermFilter(boolQuery, "accessRights.code", accessRights);
        addTermFilter(boolQuery, "publisher.orgPath", orgPath);
        addTermFilter(boolQuery, "formats", format);

        return elasticsearch.getClient()
                .prepareSearch("acat")
                .setTypes("apispec")
                .setQuery(boolQuery)
                .setFrom(checkAndAdjustFrom(from))
                .setSize(checkAndAdjustSize(size))
                .addAggregation(createTermsAggregation("accessRights", "accessRights.code"))
                .addAggregation(createTermsAggregation("formats", "formats"))
                .addAggregation(createTermsAggregation("orgPath", "publisher.orgPath"));

    }

    SearchResponse doQuery(SearchRequestBuilder searchBuilder) {
        return searchBuilder.execute().actionGet();
    }

    static void addTermFilter(BoolQueryBuilder boolQuery, String term, String value) {
        if (value.isEmpty()) return;
        BoolQueryBuilder accessRightsFilter = QueryBuilders.boolQuery();
        if (value.equals(MISSING)) {
            boolQuery.filter(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)));
        } else {
            boolQuery.filter(QueryBuilders.boolQuery().must(QueryBuilders.termQuery(term, value)));
        }

        boolQuery.filter(accessRightsFilter);
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
                .size(MAX_AGGREGATIONS)
                .order(Terms.Order.count(false));
    }
}
