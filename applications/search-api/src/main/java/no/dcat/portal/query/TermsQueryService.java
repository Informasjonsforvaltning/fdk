package no.dcat.portal.query;


import com.google.gson.Gson;
import no.dcat.shared.Dataset;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.elasticsearch.search.sort.SortOrder;
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

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.URLDecoder;
import java.net.UnknownHostException;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
  public class TermsQueryService {
    public static final String INDEX_DCAT = "dcat";

    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryService.class);
    protected Client client = null;
    private static final int NO_HITS = 0;
    private static final int AGGREGATION_NUMBER_OF_COUNTS = 10000; //be sure all theme counts are returned

    /* api names */
    public static final String QUERY_SEARCH = "/terms";

    @Value("${application.elasticsearchHost}")
    private String elasticsearchHost;

    public void setElasticsearchHost(String host) {
        elasticsearchHost = host;
    }

    @Value("${application.elasticsearchPort}")
    private int elasticsearchPort;

    @Value("${application.clusterName}")
    private String clusterName;

    @PostConstruct
    void validate(){
        assert elasticsearchHost != null;
        assert elasticsearchPort > 0;
        assert clusterName != null;
    }

    public void setClusterName(String cn) {
        clusterName = cn;
    }


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
     * @param sortfield     Defines that field that the search result shall be sorted on. Default is source
     * @param sortdirection Defines the direction of the sort, ascending or descending.
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

        logger.debug(loggMsg.toString());

        String analyzerLang = "norwegian";

        if ("en".equals(lang)) {
            analyzerLang = "english";
        }
        lang = "*"; // hardcode to search in all language fields

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
                    .field("title" + "." + lang)
                    .field("definition" + "." + lang);
        }

        logger.trace(search.toString());

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = client.prepareSearch("dcat")
                .setTypes("dataset")
                .setQuery(search)
                .setFrom(from)
                .setSize(size);

        //addSort(sortfield, sortdirection, searchBuilder);

        // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: " + response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

    private void addSort(@RequestParam(value = "sortfield", defaultValue = "source") String sortfield, @RequestParam(value = "sortdirection", defaultValue = "asc") String sortdirection, SearchRequestBuilder searchBuilder) {
        if (!sortfield.trim().isEmpty()) {

            SortOrder sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;
            StringBuilder sbSortField = new StringBuilder();

            if (!sortfield.equals("modified")) {
                sbSortField.append(sortfield).append(".raw");
            } else {
                sbSortField.append(sortfield);
            }

            searchBuilder.addSort(sbSortField.toString(), sortOrder);
        }
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
     * Retrieves the dataset record identified by the provided id. The complete dataset, as defined in elasticsearch,
     * is returned on Json-format.
     * <p/>
     *
     * @return the record (JSON) of the retrieved dataset. The complete elasticsearch response on Json-fornat is returned.
     * @Exception A http error is returned if no records is found or if any other error occured.
     */
    @CrossOrigin
    @RequestMapping(value = "/terms/**", produces = {"application/json", "text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> detail(HttpServletRequest request) {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        String id = extractIdentifier(request);

        logger.info("request for {}", id);
        try {
            id = URLDecoder.decode(id, "utf-8");
        } catch (UnsupportedEncodingException e) {
            logger.warn("id could not be decoded {}. Reason {}",id, e.getLocalizedMessage());
        }

        QueryBuilder search = QueryBuilders.idsQuery("dataset").addIds(id);

        logger.debug(String.format("Get dataset with id: %s", id));
        SearchResponse response = client.prepareSearch(INDEX_DCAT).setQuery(search).execute().actionGet();

        if (response.getHits().getTotalHits() == 0) {
            logger.error(String.format("Found no dataset with id: %s", id));
            jsonError = new ResponseEntity<>(String.format("Found no dataset with id: %s", id), HttpStatus.NOT_FOUND);

        }
        logger.trace(String.format("Found dataset: %s", response.toString()));

        if (jsonError != null) {
            return jsonError;
        }

        logger.info("request sucess for {}", id);

        String acceptHeader = request.getHeader("Accept");
        if (acceptHeader != null && !acceptHeader.isEmpty() && !acceptHeader.contains("application/json")) {
            try {
                String datasetAsJson = response.getHits().getAt(0).getSourceAsString();

                ResponseEntity<String> rdfResponse = getRdfResponse(datasetAsJson, acceptHeader);
                if (rdfResponse != null) return rdfResponse;
            } catch (Exception e) {
                logger.warn("Unable to return rdf for {}. Reason {}", id, e.getLocalizedMessage());
            }
        }

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    ResponseEntity<String> getRdfResponse(String datasetAsJson, String acceptHeader) {

        Dataset d = new Gson().fromJson(datasetAsJson, Dataset.class);

        if (acceptHeader.contains("text/turtle")) {
            return new ResponseEntity<>(DcatBuilder.transform(d, "TURTLE"), HttpStatus.OK);
        } else if (acceptHeader.contains("application/ld+json")) {
            return new ResponseEntity<>(DcatBuilder.transform(d, "JSON-LD"), HttpStatus.OK);
        } else if (acceptHeader.contains("application/rdf+xml")) {
            return new ResponseEntity<>(DcatBuilder.transform(d, "RDF/XML"), HttpStatus.OK);
        }

        return null;
    }

    String extractIdentifier(HttpServletRequest request) {
        String id = request.getServletPath().replaceFirst("/terms/","");
        id = id.replaceFirst(":/", "://");

        return id;
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

    ResponseEntity<String> initializeElasticsearchTransportClient() {
        String jsonError = "{\"error\": \"Query service is not properly initialized. Unable to connect to database (ElasticSearch)\"}";

        logger.debug("elasticsearch: " + elasticsearchHost + ":" + elasticsearchPort);
        if (client == null) {
            if (elasticsearchHost == null) {
                logger.error("Configuration property application.elasticsearchHost is not initialized. Unable to connect to Elasticsearch");
                return new ResponseEntity<String>(jsonError, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            createElasticsearchTransportClient(elasticsearchHost, elasticsearchPort);
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
    public final Client createElasticsearchTransportClient(final String host, final int port) {
        client = null;
        try {
            InetAddress inetaddress = InetAddress.getByName(host);
            InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, port);

            //TODO: Gjør cluster name til en property
            Settings settings = Settings.builder()
                    .put("cluster.name", clusterName).build();

            client = TransportClient.builder().settings(settings).build()
                    .addTransportAddress(address);
            logger.debug("Client returns! " + address.toString());
        } catch (UnknownHostException e) {
            // TODO: throw exception.
            logger.error(e.toString(), e);
        }
        logger.debug("Transport client to elasticsearch created: " + client);
        return client;
    }
}
