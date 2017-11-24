package no.dcat.portal.query;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

public class PublisherQueryService extends ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(PublisherQueryService.class);
    public static final String INDEX_DCAT = "dcat";
    public static final String TYPE_DATA_PUBLISHER = "publisher";
    public static final String QUERY_PUBLISHER = "/publisher";

    /**
     * Finds all publisher loaded into elasticsearch.
     * <p/>
     *
     * @return The complete elasticsearch response on Json-fornat is returned..
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_PUBLISHER, produces = "application/json")
    public ResponseEntity<String> publishers() {
        logger.info("/publisher query");

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search = QueryBuilders.matchAllQuery();

        SearchRequestBuilder searchQuery = getClient().prepareSearch(INDEX_DCAT).setTypes(TYPE_DATA_PUBLISHER).setQuery(search);
        SearchResponse responseSize = searchQuery.execute().actionGet();

        int totNrOfPublisher = (int) responseSize.getHits().getTotalHits();
        logger.debug("Found total number of publisher: {}", totNrOfPublisher);

        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        return new ResponseEntity<String>(responsePublisher.toString(), HttpStatus.OK);
    }
}
