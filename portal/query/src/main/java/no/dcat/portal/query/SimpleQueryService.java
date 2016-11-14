package no.dcat.portal.query;


import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, reports back results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class SimpleQueryService {
    static private Logger logger = LoggerFactory.getLogger(SimpleQueryService.class);
    static public Client client = null;
    private static final String DEFAULT_QUERY_LANGUAGE = "nb";

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
     * @param from          The starting index of the sorted hits that is returned.
     * @param size          The number of hits that is returned.
     * @param sortfield     Defines that field that the search result shall be sorted on. Default is best match.
     * @param sortdirection Defines the direction of the sort, ascending or descending.
     * @return List of  elasticsearch records.
     */

    @CrossOrigin
    @RequestMapping(value = "/search", produces = "application/json")
    public ResponseEntity<String> search(@RequestParam(value = "q", defaultValue = "") String query,
                                         @RequestParam(value = "from", defaultValue = "0") int from,
                                         @RequestParam(value = "size", defaultValue = "10") int size,
                                         @RequestParam(value = "sortfield", defaultValue = "") String sortfield,
                                         @RequestParam(value = "sortdirection", defaultValue = "desc") String sortdirection
    ) {

        //TODO: Pass user's language selection from client?
        //For now we set the default language from a constant
        String language = "*"; //DEFAULT_QUERY_LANGUAGE;
        StringBuilder loggMsg = new StringBuilder().append("query: \"").append(query).append("\" from:").append(from).append(" size:").append(size).append(" language: ").append(language).append(" sortfield:").append(sortfield);
        logger.debug(loggMsg.toString());

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
            search = QueryBuilders.multiMatchQuery(query,
                    "title" + "." + language,
                    "keyword" + "." + language,
                    "description" + "." + language,
                    "publisher.name");
            /*JSON: {
                "query": {
                   "query_string": {
                   "query": {query string}
                }
            }*/
        }

        logger.trace(search.toString());

<<<<<<< HEAD
=======

>>>>>>> FDK-105 : Added detail page.
        SearchResponse response;
        if (sortfield.trim().isEmpty()) {
            response = client.prepareSearch("dcat")
                    .setTypes("dataset")
                    .setQuery(search)
                    .setFrom(from)
                    .setSize(size)
                    .execute()
                    .actionGet();
        } else {
            SortOrder sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;
            StringBuilder sbSortField = new StringBuilder();
            if (!sortfield.equals("modified")) sbSortField.append(sortfield).append(".raw");
            else sbSortField.append(sortfield);

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

    /**
     * Retrieves the dataset record identified by the provided id.
     * @param id Id that identifies the dataset..
     * @return Rekord for the retrieved dataset.
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

        if (jsonError != null) return jsonError;

        return new ResponseEntity<String>(response.getHits().getHits()[0].getSourceAsString(), HttpStatus.OK);
    }

    private ResponseEntity<String> initializeElasticsearchTransportClient() {
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

    public Client createElasticsearchTransportClient(String host, int port) {
        client = null;
        try {
            InetAddress inetaddress = InetAddress.getByName(host);
            InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, port);

            client = TransportClient.builder().build()
                    .addTransportAddress(address);
            logger.debug("Client returns! " + address.toString());
        } catch (UnknownHostException e) {
            logger.error(e.toString());
        }

        logger.debug("Transport client to elasticsearch created: " + client);
        return client;

    }


}
