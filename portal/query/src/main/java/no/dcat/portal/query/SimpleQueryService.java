package no.dcat.portal.query;


import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.elasticsearch.search.sort.SortOrder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class SimpleQueryService {
    public static final String INDEX_THEME = "theme";
    public static final String TYPE_DATA_THEME = "data-theme";
    private static Logger logger = LoggerFactory.getLogger(SimpleQueryService.class);
    public static Client client = null;
    private static final String DEFAULT_QUERY_LANGUAGE = "nb";
    private static final int NO_HITS = 0;
    private static final int AGGREGATION_NUMBER_OF_COUNTS = 10000; //be sure all theme counts are returned

    @Value("${application.elasticsearchHost}")
    private String elasticsearchHost;

    public void setElasticsearchHost(String host) {
        elasticsearchHost = host;
    }

    @Value("${application.elasticsearchPort}")
    private int elasticsearchPort = 9300;

    /**
     * Compose and execute an elasticsearch query on dcat based on the inputparameters.
     * <p>
     *
     * @param query         The search query to be executed as defined in
     *                      https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
     *                      The search is performed on the fileds titel, keyword, description and publisher.name.
     * @param theme         Narrows the search to the specified theme. ex. GOVE
     * @param from          The starting index (starting from 0) of the sorted hits that is returned.
     * @param size          The number of hits that is returned. Max number is 100.
     * @param lang          The language of the query string. Used for analyzing the query-string.
     * @param sortfield     Defines that field that the search result shall be sorted on. Default is best match.
     * @param sortdirection Defines the direction of the sort, ascending or descending.
     * @return List of  elasticsearch records.
     */

    @CrossOrigin
    @RequestMapping(value = "/search", produces = "application/json")
    public ResponseEntity<String> search(@RequestParam(value = "q", defaultValue = "") String query,
                                         @RequestParam(value = "theme", defaultValue = "") String theme,
                                         @RequestParam(value = "from", defaultValue = "0") int from,
                                         @RequestParam(value = "size", defaultValue = "10") int size,
                                         @RequestParam(value = "lang", defaultValue = "nb") String lang,
                                         @RequestParam(value = "sortfield", defaultValue = "") String sortfield,
                                         @RequestParam(value = "sortdirection", defaultValue = "desc") String sortdirection) {


        StringBuilder loggMsg = new StringBuilder()
                .append("query: \"").append(query)
                .append("\" from:").append(from)
                .append(" size:").append(size)
                .append(" lang:").append(lang)
                .append(" sortfield:").append(sortfield)
                .append(" sortdirection:").append(sortdirection);

        logger.debug(loggMsg.toString());

        String themeLanguage = "*";
        String analyzerLang  = "norwegian";

        if ("en".equals(lang)) {
            //themeLanguage="en";
            analyzerLang = "english";
        }
        lang = "*"; // hardcode to search in all language fields

        if (from < 0) {
            return new ResponseEntity<String>("{\"error\": \"parameter error: from is less than zero\"}", HttpStatus.BAD_REQUEST);
        }

        if (size > 100) {
            return new ResponseEntity<String>("{\"error\": \"parameter error: size is larger than 100\"}", HttpStatus.BAD_REQUEST);
        }

        if (size < 5) size = 5;

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();

            /*JSON: {
                "match_all" : { }
             }*/
        } else {



            //search = QueryBuilders.queryStringQuery(query);
            /*
            search = QueryBuilders.multiMatchQuery(query,
                    "title" + "." + language,
                    "keyword" + "." + language,
                    "description" + "." + language,
                    "publisher.name",
                    "theme.title" + "." + themeLanguage);
*/

            search = QueryBuilders.simpleQueryStringQuery(query)
                    .analyzer(analyzerLang)
                    .field("title" + "." + lang)
                    .field("keyword" + "." + lang)
                    .field("theme.title" + "." + themeLanguage)
                    .field("description" + "." + lang)
                    .field("publisher.name");


            /*JSON: {
                "query": {
                   "query_string": {
                   "query": {query string}
                }
            }*/
        }

        logger.trace(search.toString());

        //Count the number of datasets for each theme in the search result
        AggregationBuilder themeAggregation = createThemeAggregation();
        BoolQueryBuilder boolQuery =  addFilter(theme, search);

        SearchResponse response;
        if (sortfield.trim().isEmpty()) {

            response = client.prepareSearch("dcat")
                    .setTypes("dataset")
                    .setQuery(boolQuery)
                    .setFrom(from)
                    .setSize(size)
                    .addAggregation(themeAggregation)
                    .execute()
                    .actionGet();
        } else {
            SortOrder sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;
            StringBuilder sbSortField = new StringBuilder();

            if (!sortfield.equals("modified")) {
                sbSortField.append(sortfield).append(".raw");
            } else {
                sbSortField.append(sortfield);
            }

            response = client.prepareSearch("dcat")
                    .setTypes("dataset")
                    .setQuery(search)
                    .setFrom(from)
                    .setSize(size)
                    .addSort(sbSortField.toString(), sortOrder)
                    .execute()
                    .actionGet();
        }

        logger.trace("Search response: " + response.toString());
        // Build query

        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

    private BoolQueryBuilder addFilter(@RequestParam(value = "theme", defaultValue = "") String theme, QueryBuilder search) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(search);

        if (!StringUtils.isEmpty(theme)) {
            boolQuery = boolQuery.filter(QueryBuilders.termQuery("theme.code", theme));
        }
        return boolQuery;
    }

    /**
     * Retrieves the dataset record identified by the provided id. The complete dataset, as defined in elasticsearch,
     * is returned on Json-format.
     * <p/>
     *
     * @return the record (JSON) of the retrieved dataset.
     * @return The complete elasticsearch response on Json-fornat is returned.
     * @Exception A http error is returned if no records is found or if any other error occured.
     */
    @CrossOrigin
    @RequestMapping(value = "/detail", produces = "application/json")
    public ResponseEntity<String> detail(@RequestParam(value = "id", defaultValue = "") String id) {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        QueryBuilder search = QueryBuilders.idsQuery("dataset").addIds(id);

        logger.debug(String.format("Get dataset with id: %s", id));
        SearchResponse response = client.prepareSearch("dcat").setQuery(search).execute().actionGet();

        if (response.getHits().getTotalHits() == 0) {
            logger.error(String.format("Found no dataset with id: %s", id));
            jsonError = new ResponseEntity<String>(String.format("Found no dataset with id: %s", id), HttpStatus.NOT_FOUND);
        }
        logger.trace(String.format("Found dataset: %s", response.toString()));

        if (jsonError != null) {
            return jsonError;
        }

        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

    /**
     * Finds all themes loaded into elasticsearch.
     * <p/>
     *
     * @return The complete elasticsearch response on Json-fornat is returned..
     */
    @CrossOrigin
    @RequestMapping(value = "/themes", produces = "application/json")
    public ResponseEntity<String> themes() {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        QueryBuilder search = QueryBuilders.matchAllQuery();

        SearchRequestBuilder searchQuery = client.prepareSearch(INDEX_THEME).setTypes(TYPE_DATA_THEME).setQuery(search);
        SearchResponse response = searchQuery.execute().actionGet();

        int totNrOfThemes = (int) response.getHits().getTotalHits();
        logger.debug(String.format("Found total number of themes: %d", totNrOfThemes));

        response = searchQuery.setSize(totNrOfThemes).execute().actionGet();
        logger.debug(String.format("Found themes: %s", response.toString()));

        if (jsonError != null) return jsonError;

        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }


    /**
     * Return a count of the number of data sets for each theme code
     * The query will not return the data sets themselves, only the counts.
     * If no parameter is specified, the result will be a set of counts for
     * all used theme codes.
     * For each theme, the result will include the theme code and an integer
     * representing the number of data sets with this theme code.
     * If the optional themecode parameter is specified, only the theme code
     * and number of data sets for this code is returned
     *
     * @param themecode optional parameter specifiying which theme should be counted
     * @return json containing theme code and integer count of number of data sets
     */
    @CrossOrigin
    @RequestMapping(value = "/themecount", produces = "application/json")
    public ResponseEntity<String> themecount(@RequestParam(value = "code", defaultValue = "") String themecode) {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        QueryBuilder search;

        if ("".equals(themecode)) {
            search = QueryBuilders.matchAllQuery();
            /*JSON: {
                "match_all" : { }
             }*/
        } else {

            search = QueryBuilders.simpleQueryStringQuery(themecode)
                    .field("theme.code");

            /*JSON: {
                "query": {
                    "match": {"theme.code" : "GOVE"}
                }
            }*/
        }

        //Create the aggregation object that counts the datasets
        AggregationBuilder aggregation = createThemeAggregation();

        logger.debug(String.format("Get theme with code: %s", themecode));
        SearchResponse response = client.prepareSearch("dcat")
                .setQuery(search)
                .setSize(NO_HITS)  //only the aggregation should be returned
                .setTypes("dataset")
                .addAggregation(aggregation)
                .execute().actionGet();

        logger.trace(String.format("Dataset count for themes: %s", response.toString()));

        if (jsonError != null) {
            return jsonError;
        }

        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }


    /**
     * Create aggregation object that counts the number of
     * datasets for each theme code
     *
     * @return Aggregation builder object to be used in query
     */
    private AggregationBuilder createThemeAggregation() {
        return AggregationBuilders
            .terms("theme_count")
            .field("theme.code")
            .size(AGGREGATION_NUMBER_OF_COUNTS)
            .order(Order.count(false));
    }


    final private ResponseEntity<String> initializeElasticsearchTransportClient() {
        String jsonError = "{\"error\": \"Query service is not properly initialized. Unable to connect to database (ElasticSearch)\"}";

        logger.debug("elasticsearch: " + elasticsearchHost + ":" + elasticsearchPort);
        if (client == null) {
            if (elasticsearchHost == null) {
                logger.error("Configuration property application.elasticsearchHost is not initialized. Unable to connect to Elasticsearch");
                return new ResponseEntity<String>(jsonError, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            client = createElasticsearchTransportClient(elasticsearchHost, elasticsearchPort);
        }
        return null;
    }

    /**
     * Create transport client for communication with elasticsearch database
     *
     * @param host Hostname of elasticsearch database
     * @param port Port number where elasticsearch service can be reached. Usually 9300
     * @return Transport client object
     */
    final public Client createElasticsearchTransportClient(final String host, final int port) {
        client = null;
        try {
            InetAddress inetaddress = InetAddress.getByName(host);
            InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, port);

            client = TransportClient.builder().build()
                    .addTransportAddress(address);
            logger.debug("Client returns! " + address.toString());
        } catch (UnknownHostException e) {
            // TODO: throw exception.
            logger.error(e.toString());
        }

        logger.debug("Transport client to elasticsearch created: " + client);
        return client;

    }
}
