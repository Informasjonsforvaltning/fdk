package no.acat.restapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.model.ApiDocument;
import no.acat.model.queryresponse.AggregationBucket;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ApiSearchController {
    public static final String MISSING = "MISSING";
    public static final int MAX_AGGREGATIONS = 10000;
    private static final Logger logger = LoggerFactory.getLogger(ApiSearchController.class);
    private ElasticsearchService elasticsearch;
    private ObjectMapper mapper;

    @Autowired
    public ApiSearchController(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearch = elasticsearchService;
        this.mapper = mapper;
    }

    static void addTermFilter(BoolQueryBuilder boolQuery, String term, String value) {
        if (value.isEmpty()) return;

        if (value.equals(MISSING)) {
            boolQuery.filter(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)));
        } else {
            boolQuery.filter(QueryBuilders.termQuery(term, value));
        }
    }

    static void addAllTermsFilter(BoolQueryBuilder boolQuery, String term, String[] values) {
        if (values == null || values.length == 0) return;

        for (String value : values) {
            boolQuery.filter(QueryBuilders.termQuery(term, value));
        }
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
        @RequestParam(value = "orgPath", defaultValue = "", required = false)
            String orgPath,

        @ApiParam("Filters on format")
        @RequestParam(value = "format", defaultValue = "", required = false)
            String[] formats,

        @ApiParam("Returns datatasets from position x in the result set, 0 is the default value. A value of 150 will return the 150th dataset in the resultset")
        @RequestParam(value = "from", defaultValue = "0", required = false)
            int from,

        @ApiParam("Specifies the size, i.e. the number of datasets to return in one request. The default is 10, the maximum number of datasets returned is 100")
        @RequestParam(value = "size", defaultValue = "10", required = false)
            int size,

        @ApiParam("Specifies the sort field, at the present we support title, modified and publisher. Default is no value")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "", required = false)
            String sortdirection

    ) {
        try {
            SearchRequestBuilder searchRequest = buildSearchRequest(query, accessRights, orgPath, formats, from, size);
            addSort(sortfield, sortdirection, searchRequest);
            if (query.isEmpty()) {
                addSortForEmptySearch(searchRequest);
            }

            SearchResponse elasticResponse = doQuery(searchRequest);
            return convertFromElasticResponse(elasticResponse);
        } catch (Exception e) {
            logger.error("error {}", e.getMessage(), e);
        }

        return null;
    }

    SearchRequestBuilder buildSearchRequest(String query, String accessRights, String orgPath, String[] formats, int from, int size) {

        QueryBuilder search;

        if (query.isEmpty()) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query);
        }

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery().must(search);

        addTermFilter(boolQuery, "publisher.orgPath", orgPath);
        addAllTermsFilter(boolQuery, "formats", formats);

        logger.debug("Built query:{}", boolQuery);

        return elasticsearch.getClient()
            .prepareSearch("acat")
            .setTypes("apidocument")
            .setQuery(boolQuery)
            .setFrom(checkAndAdjustFrom(from))
            .setSize(checkAndAdjustSize(size))
            .addAggregation(createTermsAggregation("formats", "formats"))
            .addAggregation(createTermsAggregation("orgPath", "publisher.orgPath"));

    }

    SearchResponse doQuery(SearchRequestBuilder searchBuilder) {
        return searchBuilder.execute().actionGet();
    }

    private void addSort(String sortfield, String sortdirection, SearchRequestBuilder searchBuilder) {

        //Key is search field in request from client
        //Value is actual search field in acat index, as acat datamodel is different from dcat datamodel
        //also, sort must use unanalyzed fields
        Map<String, String> allowedSearchFields = new HashMap<>();
        // We have shared logic in frontend for sorting fields both for datasets and apis.
        // It is a major hack to introduce dependency at this level, but I hope we can remove sorting functionality as a whole as soon as possible
        allowedSearchFields.put("title.nn", "title.raw");
        allowedSearchFields.put("title.nb", "title.raw");
        allowedSearchFields.put("title.no", "title.raw");
        allowedSearchFields.put("publisher.name", "publisher.prefLabel.no.keyword");

        //ony allow sorting on field contained in map. Other fields are ignored
        if (allowedSearchFields.containsKey(sortfield)) {
            SortOrder sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;
            StringBuilder sbSortField = new StringBuilder();

            sbSortField.append(allowedSearchFields.get(sortfield));

            logger.debug("Added sortfield: {} with sort direction {}", sbSortField.toString(), sortOrder.toString());

            searchBuilder.addSort(sbSortField.toString(), sortOrder);
        }
    }


    /**
     * create default sort order - national components should appear first
     */
    void addSortForEmptySearch(SearchRequestBuilder searchBuilder) {
        SortBuilder sortNationalComponentFirst = SortBuilders
            .fieldSort("nationalComponent")
            .order(SortOrder.DESC);

        searchBuilder.addSort(sortNationalComponentFirst);
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

    QueryResponse convertFromElasticResponse(SearchResponse elasticResponse) {
        logger.debug("converting response");
        QueryResponse queryResponse = new QueryResponse();
        convertHits(queryResponse, elasticResponse);
        convertAggregations(queryResponse, elasticResponse);
        return queryResponse;
    }

    void convertHits(QueryResponse queryResponse, SearchResponse elasticResponse) {

        queryResponse.setTotal(elasticResponse.getHits().getTotalHits());

        queryResponse.setHits(new ArrayList<>());
        for (SearchHit hit : elasticResponse.getHits().getHits()) {
            try {
                ApiDocument document = mapper.readValue(hit.getSourceAsString(), ApiDocument.class);
                queryResponse.getHits().add(document);
            } catch (Exception e) {
                logger.error("error {}", e.getMessage(), e);
            }
        }
    }

    void convertAggregations(QueryResponse queryResponse, SearchResponse elasticResponse) {
        queryResponse.setAggregations(new HashMap<>());
        Map<String, Aggregation> elasticAggregationsMap = elasticResponse.getAggregations().getAsMap();

        elasticAggregationsMap.forEach((aggregationName, aggregation) -> {
            no.acat.model.queryresponse.Aggregation outputAggregation = new no.acat.model.queryresponse.Aggregation() {{
                buckets = new ArrayList<>();
            }};

            ((Terms) aggregation).getBuckets().forEach((bucket) -> {
                outputAggregation.getBuckets().add(AggregationBucket.of(bucket.getKeyAsString(), bucket.getDocCount()));
            });
            queryResponse.getAggregations().put(aggregationName, outputAggregation);
        });
    }
}
