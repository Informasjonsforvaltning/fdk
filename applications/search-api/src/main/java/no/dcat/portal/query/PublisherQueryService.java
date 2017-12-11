package no.dcat.portal.query;

import lombok.Data;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

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
     * @return orgPath and name of all publisher as Json-format is returned..
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_PUBLISHER_NAMES, produces = "application/json")
    public ResponseEntity<PublisherHits> publisherNames(@RequestParam(value = "q", defaultValue = "") String query) {
        logger.info("/publisher-names query: {}", query);
        QueryBuilder search;

        initializeElasticsearchTransportClient();


        search = QueryBuilders.matchAllQuery();
        SearchRequestBuilder searchQuery = getClient().prepareSearch(INDEX_DCAT).setTypes(TYPE_DATA_PUBLISHER).setQuery(search).addFields("orgPath", "name");

        SearchResponse responseSize = searchQuery.execute().actionGet();

        int totNrOfPublisher = (int) responseSize.getHits().getTotalHits();
        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        ArrayList<PublisherHit> publisherHitList = new ArrayList<PublisherHit>();
        SearchHit[] responseHits = responsePublisher.getHits().getHits();
        for (SearchHit searchHit : responseHits) {
            publisherHitList.add(
                new PublisherHit(searchHit.field("orgPath").getValue().toString(), searchHit.field("name").getValue().toString())
            );
        }
        PublisherHits publisherHits = new PublisherHits(publisherHitList);
        return new ResponseEntity<PublisherHits>(publisherHits, HttpStatus.OK);
    }

    @Data
    public class PublisherHits {
        ArrayList<PublisherHit> hits;

        public PublisherHits(ArrayList<PublisherHit> hits) {
            this.hits = hits;
        }
    }

    @Data
    public class PublisherHit {
      String orgPath, name;

      public PublisherHit(String orgPath, String name) {
        this.orgPath = orgPath;
        this.name = name;
      }
    }
}
