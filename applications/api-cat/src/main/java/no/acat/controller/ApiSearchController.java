package no.acat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.model.ApiDocument;
import no.acat.model.queryresponse.AggregationBucket;
import no.acat.model.queryresponse.QueryResponse;
import no.acat.service.ElasticsearchService;
import org.apache.commons.lang3.ArrayUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.bucket.MultiBucketsAggregation;
import org.elasticsearch.search.aggregations.metrics.cardinality.InternalCardinality;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ApiSearchController {
    public static final String DEFAULT_RETURN_FIELDS =
        "id," +
            "title," +
            "titleFormatted," +
            "description," +
            "descriptionFormatted," +
            "formats," +
            "publisher.id," +
            "publisher.orgPath," +
            "publisher.name," +
            "publisher.prefLabel.*," +
            "nationalComponent," +
            "isOpenAccess," +
            "isOpenLicense," +
            "isFree," +
            "statusCode," +
            "deprecationInfoExpirationDate," +
            "deprecationInfoReplacedWithUrl";

    private static final Logger logger = LoggerFactory.getLogger(ApiSearchController.class);
    private ElasticsearchService elasticsearch;
    private ObjectMapper mapper;

    @Autowired
    public ApiSearchController(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearch = elasticsearchService;
        this.mapper = mapper;
    }

    @ApiOperation(value = "Queries the api catalog for api specifications",
        notes = "So far only simple queries is supported", response = QueryResponse.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "q", dataType = "string", paramType = "query", value = "Full content search"),
        @ApiImplicitParam(name = "orgPath", dataType = "string", paramType = "query", value = "Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238"),
        @ApiImplicitParam(name = "dataseturi", dataType = "string", paramType = "query", value = "Filters on uri of dataset referenced by the API."),
        @ApiImplicitParam(name = "harvestSourceUri", dataType = "string", paramType = "query", value = "Filters on harvestSourceUri external identifier"),
        @ApiImplicitParam(name = "format", dataType = "string", paramType = "query", value = "Filters on format"),
        @ApiImplicitParam(name = "title", dataType = "string", paramType = "query", value = "The title text"),
        @ApiImplicitParam(name = "datasetid", dataType = "string", paramType = "query", value = "Id of dataset referenced by the API"),
        @ApiImplicitParam(name = "active", dataType = "string", paramType = "query", value = "Filters active (not expired and not removed)"),
        @ApiImplicitParam(name = "serviceType", dataType = "string", paramType = "query", value = "Filters by service type"),
        @ApiImplicitParam(name = "orgNos", dataType = "string", paramType = "query", value = "Filters by publisher organisation number. Multiple values separated with commas."),
        @ApiImplicitParam(name = "isOpenAccess", dataType = "string", paramType = "query", value = "Filters by open access. True or false."),
        @ApiImplicitParam(name = "isOpenLicense", dataType = "string", paramType = "query", value = "Filters by open license. True or false."),
        @ApiImplicitParam(name = "isFree", dataType = "string", paramType = "query", value = "Filters by free. True or false."),

        @ApiImplicitParam(name = "page", dataType = "string", paramType = "query", defaultValue = "0", value = "Page index. First page is 0"),
        @ApiImplicitParam(name = "size", dataType = "string", paramType = "query", defaultValue = "10", value = "Page size")
    })
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public QueryResponse search(
        @ApiParam(hidden = true)
        @RequestParam Map<String, String> params,

        @ApiParam("Comma-separated list of fields in query response. If not specified, all fields are returned.")
        @RequestParam(value = "returnFields", defaultValue = DEFAULT_RETURN_FIELDS, required = false)
            String[] returnFields,

        @ApiParam("Calculate aggregations")
        @RequestParam(value = "aggregations", defaultValue = "", required = false)
            String[] aggregations,

        @ApiParam("Specifies the sort field, at the present the only value is \"modified\". Default is no value, and results are sorted by relevance")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "", required = false)
            String sortdirection,

        @PageableDefault()
            Pageable pageable
    ) {

        logger.debug("GET /apis?{}", params);

        QueryBuilder searchQuery = new ApiSearchESQueryBuilder()
            .boostNationalComponents()
            .addParams(params)
            .build();

        int from = (int) pageable.getOffset();
        int size = pageable.getPageSize();

        SearchRequestBuilder searchRequest = elasticsearch.getClient()
            .prepareSearch("acat")
            .setTypes("apidocument")
            .setQuery(searchQuery)
            .setFrom(checkAndAdjustFrom(from))
            .setSize(checkAndAdjustSize(size))
            .setFetchSource(returnFields, null);

        if (ArrayUtils.isNotEmpty(aggregations)) {
            searchRequest = addAggregations(searchRequest, aggregations);
        }

        if ("modified".equals(sortfield)) {
            SortOrder sortOrder = "asc".equals(sortdirection.toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;

            SortBuilder sortBuilder = SortBuilders.fieldSort("harvest.firstHarvested")
                .order(sortOrder)
                .missing("_last");

            logger.debug("sort: {}", sortBuilder.toString());
            searchRequest.addSort(sortBuilder);
        }

        logger.debug("Executing query: {}", searchRequest.toString());

        SearchResponse elasticResponse = searchRequest.execute().actionGet();

        return convertFromElasticResponse(elasticResponse);
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

    public SearchRequestBuilder addAggregations(SearchRequestBuilder searchBuilder, String[] aggregations) {
        HashSet<String> selectedAggregationFields = new HashSet<>(Arrays.asList(aggregations));

        if (selectedAggregationFields.contains("formats")) {
            searchBuilder
                .addAggregation(ESQueryUtil.createTermsAggregation("formats", "formats"));
        }
        if (selectedAggregationFields.contains("orgPath")) {
            searchBuilder.addAggregation(ESQueryUtil.createTermsAggregation("orgPath", "publisher.orgPath"));
        }
        if (selectedAggregationFields.contains("firstHarvested")) {
            searchBuilder.addAggregation(ESQueryUtil.createTemporalAggregation("firstHarvested", "harvest.firstHarvested"));
        }
        if (selectedAggregationFields.contains("publisher")) {
            searchBuilder.addAggregation(ESQueryUtil.createCardinalityAggregation("publisher", "publisher.id"));
        }
        if (selectedAggregationFields.contains("openAccess")) {
            searchBuilder.addAggregation(ESQueryUtil.createTermsAggregation("openAccess", "isOpenAccess"));
        }
        if (selectedAggregationFields.contains("openLicence")) {
            searchBuilder.addAggregation(ESQueryUtil.createTermsAggregation("openLicence", "isOpenLicense"));
        }
        if (selectedAggregationFields.contains("freeUsage")) {
            searchBuilder.addAggregation(ESQueryUtil.createTermsAggregation("freeUsage", "isFree"));
        }
        if (selectedAggregationFields.contains("apicatalogs")) {
            searchBuilder.addAggregation(ESQueryUtil.createTermsAggregation("publisher", "publisher.id"));
        }

        return searchBuilder;
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
        if (elasticResponse.getAggregations() == null) {
            return;
        }
        queryResponse.setAggregations(new HashMap<>());
        Map<String, Aggregation> elasticAggregationsMap = elasticResponse.getAggregations().getAsMap();

        elasticAggregationsMap.forEach((aggregationName, aggregation) -> {
            no.acat.model.queryresponse.Aggregation outputAggregation = new no.acat.model.queryresponse.Aggregation() {{
                buckets = new ArrayList<>();
            }};

            if (aggregation instanceof MultiBucketsAggregation) {
                ((MultiBucketsAggregation) aggregation).getBuckets().forEach((bucket) -> {
                    outputAggregation.getBuckets().add(AggregationBucket.of(bucket.getKeyAsString(), bucket.getDocCount()));
                });
            } else if (aggregation instanceof InternalCardinality) {
                outputAggregation.getBuckets().add(AggregationBucket.of("count", ((InternalCardinality) aggregation).getValue()));
            } else {
                throw new RuntimeException("Programmer error. Aggregation " + aggregation.getClass().getName() + " is not supported.");
            }
            queryResponse.getAggregations().put(aggregationName, outputAggregation);
        });
    }
}
