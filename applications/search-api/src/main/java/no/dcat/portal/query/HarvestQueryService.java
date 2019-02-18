package no.dcat.portal.query;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.metrics.sum.SumAggregationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
public class HarvestQueryService {
    public static final String INDEX_DCAT = "dcat";
    public static final String TYPE_DATA_PUBLISHER = "publisher";
    public static final String QUERY_PUBLISHER = "/publisher";
    private static Logger logger = LoggerFactory.getLogger(HarvestQueryService.class);
    private ElasticsearchService elasticsearch;

    @Autowired
    public HarvestQueryService(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    /**
     * @return The complete elasticsearch response on Json-format is returned..
     */
    @CrossOrigin
    @ApiOperation(value = "Finds all harvest catalog records for a given orgpath.")
    @RequestMapping(value = "/harvest/catalog", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> listCatalogHarvestRecords(
        @ApiParam("The orgpath of the publisher, e.g. /STAT or /FYLKE")
        @RequestParam(value = "q", defaultValue = "", required = false) String query) {
        logger.info("/harvest query: {}", query);

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.termQuery("publisher.orgPath", query);
        }

        SumAggregationBuilder agg1 = AggregationBuilders.sum("inserts").field("changeInformation.inserts");
        SumAggregationBuilder agg2 = AggregationBuilders.sum("updates").field("changeInformation.updates");
        SumAggregationBuilder agg3 = AggregationBuilders.sum("deletes").field("changeInformation.deletes");

        long now = new Date().getTime();
        long DAY_IN_MS = 1000 * 3600 * 24;

        RangeQueryBuilder range1 = QueryBuilders.rangeQuery("date").from(now - 7 * DAY_IN_MS).to(now).format("epoch_millis");
        RangeQueryBuilder range2 = QueryBuilders.rangeQuery("date").from(now - 30 * DAY_IN_MS).to(now).format("epoch_millis");
        RangeQueryBuilder range3 = QueryBuilders.rangeQuery("date").from(now - 365 * DAY_IN_MS).to(now).format("epoch_millis");

        AggregationBuilder last7 = AggregationBuilders.filter("last7days", range1).subAggregation(agg1).subAggregation(agg2).subAggregation(agg3);
        AggregationBuilder last30 = AggregationBuilders.filter("last30days", range2).subAggregation(agg1).subAggregation(agg2).subAggregation(agg3);
        AggregationBuilder last365 = AggregationBuilders.filter("last365days", range3).subAggregation(agg1).subAggregation(agg2).subAggregation(agg3);

        SearchRequestBuilder searchQuery = elasticsearch.getClient()
            .prepareSearch("harvest").setTypes("catalog")
            .setQuery(search)
            .addAggregation(last7)
            .addAggregation(last30)
            .addAggregation(last365)
            .setSize(0);

        logger.trace("SEARCH: {}", searchQuery.toString());
        SearchResponse response = searchQuery.execute().actionGet();

        int totNumberOfCatalogRecords = (int) response.getHits().getTotalHits();
        logger.debug("Found total number of catalog records: {}", totNumberOfCatalogRecords);

        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }


}
