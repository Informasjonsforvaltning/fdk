package no.fdk.searchapi.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import lombok.Data;
import no.dcat.shared.Publisher;
import no.fdk.searchapi.service.ElasticsearchService;
import no.fdk.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class PublisherQueryController {
    public static final String INDEX_DCAT = "dcat";
    public static final String TYPE_DATA_PUBLISHER = "publisher";
    public static final String QUERY_PUBLISHER = "/publisher";
    public static final String QUERY_PUBLISHER_HIERARCHY = "/publisher/hierarchy";
    public static final String QUERY_GET_BY_ORGNR = "/publishers/{orgNr}";
    private static Logger logger = LoggerFactory.getLogger(PublisherQueryController.class);
    private ElasticsearchService elasticsearch;

    @Autowired
    public PublisherQueryController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    /**
     * Finds all publisher loaded into elasticsearch.
     * <p/>
     *
     * @return The complete elasticsearch response on Json-format is returned..
     */
    @RequestMapping(value = QUERY_PUBLISHER, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> publishers(
        @RequestParam(value = "q", defaultValue = "", required = false) String query) {
        logger.info("/publisher query: {}", query);

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.matchPhrasePrefixQuery("name", query);
        }

        SearchRequestBuilder searchQuery = elasticsearch.getClient().prepareSearch(INDEX_DCAT).setTypes(TYPE_DATA_PUBLISHER).setQuery(search);
        SearchResponse responseSize = searchQuery.execute().actionGet();

        int totNrOfPublisher = (int) responseSize.getHits().getTotalHits();
        logger.debug("Found total number of publisher: {}", totNrOfPublisher);

        SearchResponse responsePublisher = searchQuery.setSize(totNrOfPublisher).execute().actionGet();
        logger.debug("Found publisher: {}", responsePublisher);

        return new ResponseEntity<>(responsePublisher.toString(), HttpStatus.OK);
    }

    /**
     * Retrieves the publisher record identified by the provided orgnr.
     *
     * @return the record (JSON) of the retrieved publisher.
     */
    @RequestMapping(
        value = QUERY_GET_BY_ORGNR,
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Publisher getPublisherByOrgNrHandler(
        @PathVariable String orgNr)
        throws NotFoundException {
        logger.info(String.format("Get publisher with OrgNr: %s", orgNr));

        return getPublisherByOrgNr(orgNr);
    }

    Publisher getPublisherByOrgNr(String orgNr) throws NotFoundException {
        GetResponse elasticGetResponse = elasticsearch.getClient().prepareGet(INDEX_DCAT, TYPE_DATA_PUBLISHER, orgNr).get();

        if (!elasticGetResponse.isExists()) {
            throw new NotFoundException();
        }

        String publisherAsJson = elasticGetResponse.getSourceAsString();
        logger.trace(String.format("Found publisher: %s", publisherAsJson));

        return new Gson().fromJson(publisherAsJson, Publisher.class);
    }

    /**
     * Finds all publisher loaded into elasticsearch and returns a tree of them.
     *
     * @return orgPath and name of all publisher with children in a tree as Json-format is returned..
     */
    @RequestMapping(value = QUERY_PUBLISHER_HIERARCHY, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Hits> publisherNames() {
        /**
         * Get publishers from empty query using publishers
         */
        ResponseEntity<String> publisherResponseEntity = publishers("");
        Gson gson = new Gson();
        JsonObject hits = gson.fromJson(publisherResponseEntity.getBody(), JsonObject.class);
        JsonArray jsonArray = hits.getAsJsonObject("hits").getAsJsonArray("hits");
        List<PublisherHit> publisherHitList = new ArrayList<>();

        /**
         * Build flat list of PublisherHit from jsonArray.
         */

        Type type = new TypeToken<Map<String, String>>() {
        }.getType();

        for (JsonElement element : jsonArray) {
            JsonObject jsonObject = element.getAsJsonObject().get("_source").getAsJsonObject();

            PublisherHit publisherHit = new PublisherHit();
            publisherHit.children = new ArrayList<>();
            publisherHit.name = jsonObject.get("name").getAsString();
            publisherHit.orgPath = jsonObject.get("orgPath").getAsString();
            if (jsonObject.get("prefLabel") != null) {
                publisherHit.prefLabel = gson.fromJson(jsonObject.get("prefLabel").toString(), type);
            }
            publisherHitList.add(publisherHit);
        }

        List<PublisherHit> publisherHitListWithChildren = new ArrayList<>();

        /**
         * Building tree from flat list
         */
        for (PublisherHit publisherHit : publisherHitList) {
            PublisherHit dummyParent = new PublisherHit();
            dummyParent.orgPath = getParentOrgPath(publisherHit.orgPath);
            int parentIndex = publisherHitList.indexOf(dummyParent);

            /**
             * If publisher has parent, need to add it to list, or if already added need to add publisher to parents children.
             */
            if (parentIndex >= 0) {
                PublisherHit parentMatch = publisherHitList.get(parentIndex);
                int parentAlreadyAdded = publisherHitListWithChildren.indexOf(parentMatch);

                if (parentAlreadyAdded >= 0) {
                    publisherHitListWithChildren.get(parentAlreadyAdded).children.add(publisherHit);
                } else {
                    parentMatch.children.add(publisherHit);
                    publisherHitListWithChildren.add(parentMatch);
                }
                /**
                 * Publisher is a root parent, need to add it to the list in the case where a child has not already done this.
                 */
            } else {
                int imAlreadyAdded = publisherHitListWithChildren.indexOf(publisherHit);
                if (imAlreadyAdded < 0) {
                    publisherHitListWithChildren.add(publisherHit);
                }
            }
        }

        /**
         * Removed any potential root duplicates or non root parents added to root level.
         */
        List<PublisherHit> result = publisherHitListWithChildren.stream()
            .filter(publisherHit -> getParentOrgPath(publisherHit.orgPath).compareTo("") == 0)
            .map(parent -> sortChildren(parent))
            .collect(Collectors.toList());

        /**
         * Hardcoded in sorting for root elements.
         */
        Hits wrapper = new Hits();
        wrapper.hits = new ArrayList<>();

        PublisherHit dummyStat = new PublisherHit();
        dummyStat.orgPath = "/STAT";
        wrapper.hits.add(result.get(result.indexOf(dummyStat)));

        PublisherHit dummyFylke = new PublisherHit();
        dummyFylke.orgPath = "/FYLKE";
        wrapper.hits.add(result.get(result.indexOf(dummyFylke)));

        PublisherHit dummyKommune = new PublisherHit();
        dummyKommune.orgPath = "/KOMMUNE";
        wrapper.hits.add(result.get(result.indexOf(dummyKommune)));

        PublisherHit dummyPrivat = new PublisherHit();
        dummyPrivat.orgPath = "/PRIVAT";
        wrapper.hits.add(result.get(result.indexOf(dummyPrivat)));

        PublisherHit dummyAnnet = new PublisherHit();
        dummyAnnet.orgPath = "/ANNET";
        wrapper.hits.add(result.get(result.indexOf(dummyAnnet)));
        return new ResponseEntity<>(wrapper, HttpStatus.OK);
    }

    /**
     * @param orgPath of publisher.
     * @return orgPath of publishers parent.
     */
    public String getParentOrgPath(String orgPath) {
        int to = orgPath.lastIndexOf("/");
        return orgPath.substring(0, (to < 0) ? 0 : to);
    }

    /**
     * Recursively sort a parents children (and childrens children.. etc).
     *
     * @param parent publisher.
     * @return parent publisher with all its children sorted alphabetically.
     */
    public PublisherHit sortChildren(PublisherHit parent) {
        if (parent.children.size() > 0) {
            parent.children.sort(PublisherHit::compareTo);
            parent.children = parent.children.stream().map(child -> sortChildren(child)).collect(Collectors.toList());
            return parent;
        } else {
            return parent;
        }
    }

    /**
     * Wrapper for tree of publishers to return correct form in JSON.
     */
    @Data
    public class Hits {
        List<PublisherHit> hits;
    }

    /**
     * Represents a publisher and its children.
     */
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public class PublisherHit implements Comparable<PublisherHit> {
        String name, orgPath;
        Map<String, String> prefLabel;
        List<PublisherHit> children;

        /**
         * To check on orgPath only.
         */
        @Override
        public boolean equals(Object o) {
            if (o == this) return true;
            if (!(o instanceof PublisherHit)) {
                return false;
            }
            PublisherHit user = (PublisherHit) o;
            return user.orgPath.equals(orgPath);
        }

        @Override
        public int hashCode() {
            return orgPath.hashCode();
        }

        /**
         * To sort on name only.
         */
        @Override
        public int compareTo(PublisherHit o) {
            boolean lhs_dep = name.toLowerCase().contains("departementet");
            boolean rhs_dep = o.name.toLowerCase().contains("departementet");

            if (lhs_dep && !rhs_dep) {
                return -1;
            } else if (!lhs_dep && rhs_dep) {
                return 1;
            }

            return name.compareTo(o.name);
        }
    }
}
