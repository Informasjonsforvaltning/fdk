package no.dcat.portal.query;

import org.apache.lucene.queryparser.xml.builders.FilteredQueryBuilder;
import org.apache.lucene.queryparser.xml.builders.RangeFilterBuilder;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.metrics.sum.SumBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.Date;

@RestController
public class HarvestQueryService extends ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(HarvestQueryService.class);
    public static final String INDEX_DCAT = "dcat";
    public static final String TYPE_DATA_PUBLISHER = "publisher";
    public static final String QUERY_PUBLISHER = "/publisher";

    /**
     * Finds all harvest catalog records for a given orgpath
     * <p/>
     *
     * @return The complete elasticsearch response on Json-format is returned..
     */
    @CrossOrigin
    @RequestMapping(value = "/harvest/catalog", produces = "application/json")
    public ResponseEntity<String> catalogHarvests(@RequestParam(value = "q", defaultValue = "") String query) {
        logger.info("/harvest query: {}", query);

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        SumBuilder agg1 = AggregationBuilders.sum("inserts").field("changeInformation.inserts");
        SumBuilder agg2 = AggregationBuilders.sum("updates").field("changeInformation.updates");
        SumBuilder agg3 = AggregationBuilders.sum("deletes").field("changeInformation.deletes");

        //AggregationBuilder aggBuilder = AggregationBuilders.

        long now = new Date().getTime();
        long DAY_IN_MS = 1000 * 3600 *24;
        RangeQueryBuilder range1 = QueryBuilders.rangeQuery("last7").from(now - 7*DAY_IN_MS).to(now);
        RangeQueryBuilder range2 = QueryBuilders.rangeQuery("last30").from(now - 30*DAY_IN_MS).to(now);
        RangeQueryBuilder range3 = QueryBuilders.rangeQuery("last365").from(now - 365*DAY_IN_MS).to(now);

        BoolQueryBuilder bool = QueryBuilders.boolQuery();
        bool.must(range1);

        QueryBuilder search = QueryBuilders.queryStringQuery("_type:catalog");





        SearchRequestBuilder searchQuery = getClient()
                .prepareSearch("harvest").setTypes("catalog")
                .setQuery(search)
                //.setAggregations(agg1)
                ;
        SearchResponse responseSize = searchQuery.execute().actionGet();

        int totNrOfPublisher = (int) responseSize.getHits().getTotalHits();
        logger.debug("Found total number of publisher: {}", totNrOfPublisher);

        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        return new ResponseEntity<String>(responsePublisher.toString(), HttpStatus.OK);
    }

    String query = "{\n" +
            "  \"size\": 0,\n" +
            "  \"aggs\": {\n" +
            "    \"2\": {\n" +
            "      \"sum\": {\n" +
            "        \"field\": \"changeInformation.inserts\"\n" +
            "      }\n" +
            "    },\n" +
            "    \"3\": {\n" +
            "      \"sum\": {\n" +
            "        \"field\": \"changeInformation.deletes\"\n" +
            "      }\n" +
            "    },\n" +
            "    \"4\": {\n" +
            "      \"sum\": {\n" +
            "        \"field\": \"changeInformation.updates\"\n" +
            "      }\n" +
            "    }\n" +
            "  },\n" +
            "  \"highlight\": {\n" +
            "    \"pre_tags\": [\n" +
            "      \"@kibana-highlighted-field@\"\n" +
            "    ],\n" +
            "    \"post_tags\": [\n" +
            "      \"@/kibana-highlighted-field@\"\n" +
            "    ],\n" +
            "    \"fields\": {\n" +
            "      \"*\": {}\n" +
            "    },\n" +
            "    \"require_field_match\": false,\n" +
            "    \"fragment_size\": 2147483647\n" +
            "  },\n" +
            "  \"query\": {\n" +
            "    \"filtered\": {\n" +
            "      \"query\": {\n" +
            "        \"query_string\": {\n" +
            "          \"query\": \"_type:catalog\",\n" +
            "          \"analyze_wildcard\": true\n" +
            "        }\n" +
            "      },\n" +
            "      \"filter\": {\n" +
            "        \"bool\": {\n" +
            "          \"must\": [\n" +
            "            {\n" +
            "              \"range\": {\n" +
            "                \"date\": {\n" +
            "                  \"gte\": 1511165630954,\n" +
            "                  \"lte\": 1511770430954,\n" +
            "                  \"format\": \"epoch_millis\"\n" +
            "                }\n" +
            "              }\n" +
            "            }\n" +
            "          ],\n" +
            "          \"must_not\": []\n" +
            "        }\n" +
            "      }\n" +
            "    }\n" +
            "  }\n" +
            "}";
}
