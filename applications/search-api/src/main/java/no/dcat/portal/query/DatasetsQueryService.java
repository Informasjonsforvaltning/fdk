package no.dcat.portal.query;


import com.google.gson.Gson;
import no.dcat.shared.Dataset;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsQueryService extends ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryService.class);

    public static final String INDEX_DCAT = "dcat";

    public static final String TYPE_DATASET = "dataset";

    public static final String FIELD_THEME_CODE = "theme.code";
    public static final String FIELD_PUBLISHER_NAME = "publisher.name.raw";
    public static final String FIELD_ACCESS_RIGHTS_PREFLABEL = "accessRights.code.raw";
    public static final String FIELD_SUBJECTS_PREFLABEL = "subject.code.raw";

    public static final String TERMS_THEME_COUNT = "theme_count";
    public static final String TERMS_PUBLISHER_COUNT = "publisherCount";
    public static final String TERMS_ACCESS_RIGHTS_COUNT = "accessRightsCount";
    public static final String TERMS_SUBJECTS_COUNT = "subjectsCount";
    public static final String AGGREGATE_DATASET = "/aggregateDataset";

    private static final int NO_HITS = 0;
    private static final int AGGREGATION_NUMBER_OF_COUNTS = 10000; //be sure all theme counts are returned

    /* api names */
    public static final String QUERY_SEARCH = "/datasets";
    public static final String QUERY_THEME_COUNT = "/themecount";

    public static final String QUERY_PUBLISHER_COUNT = "/publishercount";


    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @param query         The search query to be executed as defined in
     *                      https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
     *                      The search is performed on the fileds titel, keyword, description and publisher.name.
     * @param theme         Narrows the search to the specified theme. ex. GOVE
     * @param publisher     Narrows the search to the specified publisher. ex. UTDANNINGSDIREKTORATET
     * @param accessRights   Narrows the search to the specified theme. ex. RESTRICTED
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
                                         @RequestParam(value = "theme", defaultValue = "") String theme,
                                         @RequestParam(value = "publisher", defaultValue = "") String publisher,
                                         @RequestParam(value = "accessrights", defaultValue = "") String accessRights,
                                         @RequestParam(value = "from", defaultValue = "0") int from,
                                         @RequestParam(value = "size", defaultValue = "10") int size,
                                         @RequestParam(value = "lang", defaultValue = "nb") String lang,
                                         @RequestParam(value = "sortfield", defaultValue = "source") String sortfield,
                                         @RequestParam(value = "sortdirection", defaultValue = "asc") String sortdirection) {


        StringBuilder loggMsg = new StringBuilder()
                .append("query: \"").append(query)
                .append("\" from:").append(from)
                .append(" size:").append(size)
                .append(" lang:").append(lang)
                .append(" sortfield:").append(sortfield)
                .append(" sortdirection:").append(sortdirection)
                .append(" theme:").append(theme)
                .append(" publisher:").append(publisher)
                .append(" accessRights:").append(accessRights);

        logger.debug(loggMsg.toString());

        String themeLanguage = "*";
        String analyzerLang = "norwegian";

        if ("en".equals(lang)) {
            //themeLanguage="en";
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
                    .field("objective" + "." + lang)
                    .field("keyword" + "." + lang)
                    .field("theme.title" + "." + themeLanguage)
                    .field("description" + "." + lang)
                    .field("publisher.name")
                    .field("accessRights.prefLabel" + "." + lang)
                    .field("accessRights.code");
        }

        logger.trace(search.toString());

        // add filter
        BoolQueryBuilder boolQuery = addFilter(theme, publisher, accessRights, search);

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = getClient().prepareSearch("dcat")
                .setTypes("dataset")
                .setQuery(boolQuery)
                .setFrom(from)
                .setSize(size)
                .addAggregation(createAggregation(TERMS_SUBJECTS_COUNT, FIELD_SUBJECTS_PREFLABEL, "Ukjent"))
                .addAggregation(createAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL, "Ukjent"))
                .addAggregation(createAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE, "Ukjent"))
                .addAggregation(createAggregation(TERMS_PUBLISHER_COUNT, FIELD_PUBLISHER_NAME, "Ukjent"))
                .addAggregation(createAggregation("orgPath", "publisher.orgPath", "Ukjent"));


        addSort(sortfield, sortdirection, searchBuilder);

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
     * Adds theme filter to query. Multiple themes can be specified. It should return only those datasets that have
     * all themes. To get an exact match we ned to use Elasticsearch tag count trick.
     *
     * @param theme  comma separated list of theme codes
     * @param search the search object
     * @return a new bool query with the added filter.
     */
    private BoolQueryBuilder addFilter(String theme, String publisher, String accessRights, QueryBuilder search) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(search);

        BoolQueryBuilder boolFilter = QueryBuilders.boolQuery();

        // theme can contain multiple themes, example: AGRI,HEAL
        if (!StringUtils.isEmpty(theme)) {

            for (String t : theme.split(",")) {
              if(t.equals("Ukjent")) {
                boolFilter.must(QueryBuilders.missingQuery("theme.code"));
              } else {
                boolFilter.must(QueryBuilders.termQuery("theme.code", t));
              }
            }

            boolQuery.filter(boolFilter);
        }

        if (!StringUtils.isEmpty(publisher)) {
            BoolQueryBuilder boolFilter2 = QueryBuilders.boolQuery();
            if(publisher.equals("Ukjent")) {
              boolFilter2.must(QueryBuilders.missingQuery("publisher.name.raw"));
            } else {
              boolFilter2.must(QueryBuilders.termQuery("publisher.name.raw", publisher));
            }

            boolQuery.filter(boolFilter2);
        }

        if (!StringUtils.isEmpty(accessRights)) {
            BoolQueryBuilder boolFilter3 = QueryBuilders.boolQuery();
            if(accessRights.equals("Ukjent")) {
              boolFilter3.must(QueryBuilders.missingQuery("accessRights.code.raw"));
            } else {
              boolFilter3.must(QueryBuilders.termQuery("accessRights.code.raw", accessRights));
            }

            boolQuery.filter(boolFilter3);
        }

        return boolQuery;
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
    @RequestMapping(value = "/datasets/**", produces = {"application/json", "text/turtle", "application/ld+json", "application/rdf+xml"})
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
        SearchResponse response = getClient().prepareSearch(INDEX_DCAT).setQuery(search).execute().actionGet();

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
        String id = request.getServletPath().replaceFirst("/datasets/","");
        id = id.replaceFirst(":/", "://");

        return id;
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
    @RequestMapping(value = QUERY_THEME_COUNT, produces = "application/json")
    public ResponseEntity<String> themecount(@RequestParam(value = "code", defaultValue = "") String themecode) {
        return aggregateOnField(FIELD_THEME_CODE, themecode, TERMS_THEME_COUNT, "Ukjent");
    }

    /**
     * Returns a list of publishers and the total number of dataset for each of them.
     * <p/>
     * The returnlist will consist of the defined publisher or for all publishers, registered in
     * elastic search, if no publisher is defined.
     * <p/>
     *
     * @param publisher optional parameter specifiying which publisher should be counted
     * @return json containing publishers and integer count of number of data sets
     */
    @CrossOrigin
    @RequestMapping(value = QUERY_PUBLISHER_COUNT, produces = "application/json")
    public ResponseEntity<String> publisherCount(@RequestParam(value = "publisher", defaultValue = "") String publisher) {
        return aggregateOnField(FIELD_PUBLISHER_NAME, publisher, TERMS_PUBLISHER_COUNT, "Ukjent");
    }



    private ResponseEntity<String> aggregateOnField(String field, String fieldValue, String term, String missing) {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        QueryBuilder search;

        if (StringUtils.isEmpty(fieldValue)) {
            logger.debug(String.format("Count datasets for all %s", field));
            search = QueryBuilders.matchAllQuery();
            /*JSON: {
                "match_all" : { }
             }*/
        } else {
            logger.debug(String.format("Count datasets for %s of type %s.", fieldValue, field));
            search = QueryBuilders.simpleQueryStringQuery(fieldValue)
                    .field(field);

            /*JSON: {
                "query": {
                    "match": {"theme.code" : "GOVE"}
                }
            }*/
        }

        //Create the aggregation object that counts the datasets
        AggregationBuilder aggregation = createAggregation(term, field, missing);

        SearchResponse response = getClient().prepareSearch(INDEX_DCAT)
                .setQuery(search)
                .setSize(NO_HITS)  //only the aggregation should be returned
                .setTypes(TYPE_DATASET)
                .addAggregation(aggregation)
                .execute().actionGet();

        logger.debug(aggregation.toString());

        logger.trace(String.format("Dataset count for field %s: %s", field, response.toString()));

        if (jsonError != null) {
            return jsonError;
        }

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
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


    /**
     * Aggregation based on orgPath.
     *
     * @param query the first part or complete orgPath
     * @return the aggregations of datasets with terms, accessRights, subjects, publishers, orgPath and distributions
     */

    @CrossOrigin
    @RequestMapping(value = AGGREGATE_DATASET, produces = "application/json")
    public ResponseEntity<String> aggregateDatasets(@RequestParam(value = "q", defaultValue = "") String query) {

        logger.info("{} of {}", AGGREGATE_DATASET, query);

        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();
        if (jsonError != null) return jsonError;

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.termQuery("publisher.orgPath", query);
        }

        logger.trace(search.toString());

        AggregationBuilder datasetsWithDistribution = AggregationBuilders.filter("distCount")
                .filter(QueryBuilders.existsQuery("distribution"));

        AggregationBuilder openDatasetsWithDistribution = AggregationBuilders.filter("distOnPublicAccessCount")
                .filter(QueryBuilders.boolQuery()
                        .must(QueryBuilders.existsQuery("distribution"))
                        .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
                );

        AggregationBuilder datasetsWithSubject = AggregationBuilders.filter("subjectCount")
                .filter(QueryBuilders.existsQuery("subject.prefLabel"));

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = getClient().prepareSearch("dcat")
                .setTypes("dataset")
                .setQuery(search)
                .setSize(0)
                .addAggregation(createAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL, "Ukjent"))
                .addAggregation(createAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE, "Ukjent"))
                .addAggregation(createAggregation(TERMS_PUBLISHER_COUNT, FIELD_PUBLISHER_NAME, "Ukjent"))
                .addAggregation(createAggregation("orgPath", "publisher.orgPath", "Ukjent"))
                .addAggregation(datasetsWithDistribution)
                .addAggregation(openDatasetsWithDistribution)
                .addAggregation(datasetsWithSubject)
                ;

                // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: " + response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

}
