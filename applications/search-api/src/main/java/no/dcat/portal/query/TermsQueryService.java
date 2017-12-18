package no.dcat.portal.query;


import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
  public class TermsQueryService extends ElasticsearchService {
    public static final String INDEX_DCAT = "dcat";

    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryService.class);
    private static final int AGGREGATION_NUMBER_OF_COUNTS = 10000; //be sure all theme counts are returned

    /* api names */
    public static final String QUERY_SEARCH = "/terms";


    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @param query         The search query to be executed as defined in
     *                      https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
     *                      The search is performed on the fields title and definition
     * @param from          The starting index (starting from 0) of the sorted hits that is returned.
     * @param size          The number of hits that is returned. Max number is 100.
     * @param lang          The language of the query string. Used for analyzing the query-string.
      * @return List of  elasticsearch records.
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_SEARCH, produces = "application/json")
    public ResponseEntity<String> search(@RequestParam(value = "q", defaultValue = "") String query,
                                         @RequestParam(value = "from", defaultValue = "0") int from,
                                         @RequestParam(value = "size", defaultValue = "10") int size,
                                         @RequestParam(value = "lang", defaultValue = "nb") String lang) {


        StringBuilder loggMsg = new StringBuilder()
                .append("query: \"").append(query)
                .append("\" from:").append(from)
                .append(" size:").append(size)
                .append(" lang:").append(lang);

        logger.info(loggMsg.toString());

        String analyzerLang = "norwegian";

        if ("en".equals(lang)) {
            analyzerLang = "english";
        }
        lang = "no"; // hardcode to search in all language fields

        from = checkAndAdjustFrom(from);
        size = checkAndAdjustSize(size);

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query)
                    .analyzer(analyzerLang)
                    .field("prefLabel" + "." + lang).boost(15)
                    .field("altLabel" + "." + lang).boost(5)
                    .field("definition" + "." + lang).boost(3)
                    .field("creator.name").boost(2)
                    .field("inScheme")
                    .field("note" + "." + lang);
        }

        logger.trace(search.toString());

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = client.prepareSearch("dcat")
                .setTypes("subject")
                .setQuery(search)
                .setFrom(from)
                .setSize(size);

        //addSort(sortfield, sortdirection, searchBuilder);

        // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: {}", response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
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

        if (size < 5) {
            return 5;
        }

        return size;
    }



    /**
     * Create aggregation object that counts the number of
     * datasets for each value of the defined field.
     * <p/>
     *
     * @param field The field to be aggregated.
     * @return Aggregation builder object to be used in query
     */
    private AggregationBuilder createAggregation(String terms, String field, String missing) {
        return AggregationBuilders
                .terms(terms)
                .missing(missing)
                .field(field)
                .size(AGGREGATION_NUMBER_OF_COUNTS)
                .order(Order.count(false));
    }



}
