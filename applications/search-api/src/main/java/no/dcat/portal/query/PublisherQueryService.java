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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublisherQueryService extends ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(PublisherQueryService.class);
    public static final String INDEX_DCAT = "dcat";
    public static final String TYPE_DATA_PUBLISHER = "publisher";
    public static final String QUERY_PUBLISHER = "/publisher";
    public static final String QUERY_PUBLISHER_NAMES = "/publisher-names";
    /**
     * Finds all publisher loaded into elasticsearch.
     * <p/>
     *
     * @return The complete elasticsearch response on Json-format is returned..
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_PUBLISHER, produces = "application/json")
    public ResponseEntity<String> publishers(@RequestParam(value = "q", defaultValue = "") String query) {
        logger.info("/publisher query: {}", query);

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.matchPhrasePrefixQuery("name", query);
        }

        SearchRequestBuilder searchQuery = getClient().prepareSearch(INDEX_DCAT).setTypes(TYPE_DATA_PUBLISHER).setQuery(search);
        SearchResponse responseSize = searchQuery.execute().actionGet();

        int totNrOfPublisher = (int) responseSize.getHits().getTotalHits();
        logger.debug("Found total number of publisher: {}", totNrOfPublisher);

        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        return new ResponseEntity<String>(responsePublisher.toString(), HttpStatus.OK);
    }


    /**
     * Finds all publisher loaded into elasticsearch.
     * <p/>
     *
     * @return The complete elasticsearch response on Json-format is returned..
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_PUBLISHER_NAMES, produces = "application/json")
    public ResponseEntity<List<Hit>> publisherNames(@RequestParam(value = "q", defaultValue = "") String query) {
        logger.info("/publisher query: {}", query);

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search;

        search = QueryBuilders.matchAllQuery();
/*
        String[] includeFields = new String[] {"orgPath", "name"};
        String[] excludeFields = new String[] {"_type"};
        sourceBuilder.fetchSource(includeFields, excludeFields);*/
        SearchRequestBuilder searchQuery = getClient().prepareSearch(INDEX_DCAT).setTypes(TYPE_DATA_PUBLISHER).setQuery(search).addFields("orgPath", "name");

        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        ArrayList<Hit> hits = new ArrayList<Hit>();
        responsePublisher.getHits().forEach(hit -> hits.add( new Hit(hit.fields.orgPath, hit.fields.name)));

        return new ResponseEntity<List<Hit>>(hits, HttpStatus.OK);
    }

    private class Hit {
      String orgPath, name;

      public Hit(String orgPath, String name) {
        this.orgPath = orgPath;
        this.name = name;
      }
    }
}
