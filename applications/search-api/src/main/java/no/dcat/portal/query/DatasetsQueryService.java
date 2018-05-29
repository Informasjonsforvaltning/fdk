package no.dcat.portal.query;


import com.google.gson.Gson;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.shared.Dataset;
import no.dcat.shared.SkosConcept;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.index.query.SimpleQueryStringBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Date;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsQueryService extends ElasticsearchService {
    public static final String UNKNOWN = "Ukjent";
    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryService.class);

    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";

    public static final String INDEX_DCAT = "dcat";

    public static final String TYPE_DATASET = "dataset";

    public static final String FIELD_THEME_CODE = "theme.code";
    public static final String FIELD_PUBLISHER_NAME = "publisher.name.raw";
    public static final String FIELD_ACCESS_RIGHTS_PREFLABEL = "accessRights.code.raw";
    public static final String FIELD_SUBJECTS_PREFLABEL = "subject.prefLabel.no";

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
    public static final long DAY_IN_MS = 1000 * 3600 * 24;


    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @return List of  elasticsearch records.
     */
    @CrossOrigin
    @ApiOperation(value = "queries the catalog for datasets",
            notes = "Returns a list of matching datasets wrapped in a elasticsearch response. " +
                    "Max number returned by a single query is 100. Size parameters greater than 100 will not return more than 100 datasets. " +
                    "In order to access all datasets, use multiple queries and increment from parameter.", response = Dataset.class)
    @RequestMapping(value = QUERY_SEARCH, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> search(@ApiParam("the query string") @RequestParam(value = "q", defaultValue = "", required = false) String query,

                                         @ApiParam("Filters on specified theme(s). ex. GOVE, or GOVE,SOCI")
                                         @RequestParam(value = "theme", defaultValue = "", required = false) String theme,

                                         @ApiParam("Filters on publisher name")
                                         @RequestParam(value = "publisher", defaultValue = "", required = false) String publisher,

                                         @ApiParam("Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC ")
                                         @RequestParam(value = "accessrights", defaultValue = "", required = false) String accessRights,

                                         @ApiParam("Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238")
                                         @RequestParam(value = "orgPath", defaultValue = "", required = false) String orgPath,

                                         @ApiParam("Filters datasets that were first harvested x-days ago, e.g. a value of 100 will result in datasets that were harvested more than 100 days ago")
                                         @RequestParam(value = "firstHarvested", defaultValue = "0", required = false) int firstHarvested,

                                         @ApiParam("Filters datasets that were last harvested x-days ago, e.g. 10 will result in datasets that have not been harvested for the last 10 days.")
                                         @RequestParam(value = "lastHarvested", defaultValue = "0", required = false) int lastHarvested,

                                         @ApiParam("Filters datasets that has changed within the last x-days, e.g. a value of 10 will result in datasets that were changed during 10 days, i.e. its values have changed within the last 10 days")
                                         @RequestParam(value = "lastChanged", defaultValue = "0", required = false) int lastChanged,

                                         @ApiParam("Returns datatasets from position x in the result set, 0 is the default value. A value of 150 will return the 150th dataset in the resultset")
                                         @RequestParam(value = "from", defaultValue = "0", required = false) int from,

                                         @ApiParam("Specifies the size, i.e. the number of datasets to return in one request. The default is 10, the maximum number of datasets returned is 100")
                                         @RequestParam(value = "size", defaultValue = "10", required = false) int size,

                                         @ApiParam("Specifies the language elements of the datasets to search in, default is nb")
                                         @RequestParam(value = "lang", defaultValue = "nb", required = false) String lang,

                                         @ApiParam("Specifies the sort field, at the present we support title, modified and publisher. Default is no value")
                                         @RequestParam(value = "sortfield", defaultValue = "", required = false) String sortfield,

                                         @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
                                         @RequestParam(value = "sortdirection", defaultValue = "", required = false) String sortdirection,

                                         @ApiParam("Filters datasets according their referred subjects")
                                         @RequestParam(value = "subject", defaultValue = "", required = false) String subject,

                                         @ApiParam("Filters datasets according to their provenance code, e.g. NASJONAL - nasjonal building block, VEDTAK - governmental decisions, BRUKER - user collected data and TREDJEPART - third party data")
                                         @RequestParam(value = "provenance", defaultValue = "", required = false) String provenance,

                                         @ApiParam("Filters datasets according to their spatial label, e.g. Oslo, Norge")
                                         @RequestParam(value = "spatial", defaultValue = "", required = false) String spatial) {


        StringBuilder loggMsg = new StringBuilder()
                .append(" query:").append(query)
                .append(" theme:").append(theme)
                .append(" publisher:").append(publisher)
                .append(" accessRights:").append(accessRights)
                .append(" orgPath:").append(orgPath)
                .append(" firstHarvested:").append(firstHarvested)
                .append(" lastHarvested:").append(lastHarvested)
                .append(" lastChanged:").append(lastChanged)
                .append(" from:").append(from)
                .append(" size:").append(size)
                .append(" lang:").append(lang)
                .append(" sortfield:").append(sortfield)
                .append(" sortdirection:").append(sortdirection)
                .append(" subject:").append(subject)
                .append(" provenance:").append(provenance)
                .append(" spatial:").append(spatial);

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

        boolean emptySearch = isEmpty(query);

        boolean emptyFilter = isEmpty(theme) &&
                isEmpty(accessRights) && isEmpty(provenance) &&
                isEmpty(orgPath) && isEmpty(publisher) &&
                isEmpty(sortfield) && isEmpty(sortdirection) &&
                isEmpty(subject) && firstHarvested == 0 && lastChanged == 0 && lastHarvested == 0 &&
                isEmpty(provenance) && isEmpty(spatial);

        QueryBuilder search;

        if (emptySearch) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.simpleQueryStringQuery(query)

                    .analyzer(analyzerLang)
                    .field("title" + "." + lang).boost(3f)
                    .field("objective" + "." + lang)
                    .field("keyword" + "." + lang).boost(2f)
                    .field("theme.title" + "." + themeLanguage)
                    .field("description" + "." + lang)
                    .field("publisher.name").boost(3f)
                    .field("accessRights.prefLabel" + "." + lang)
                    .field("accessRights.code")
                    .field("subject.prefLabel." + lang)
                    .field("subject.altLabel." + lang)
                    .field("subject.definition." + lang)
                    .defaultOperator(SimpleQueryStringBuilder.Operator.OR);
        }

        // add filter
        BoolQueryBuilder boolQuery = addFilter(theme, publisher, accessRights, search, orgPath, firstHarvested, lastHarvested, lastChanged, subject, provenance, spatial);

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = getClient().prepareSearch("dcat")
                .setTypes("dataset")
                .setQuery(boolQuery)
                .setFrom(from)
                .setSize(size)
                .addAggregation(createAggregation(TERMS_SUBJECTS_COUNT, FIELD_SUBJECTS_PREFLABEL, UNKNOWN))
                .addAggregation(createAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL, UNKNOWN))
                .addAggregation(createAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE, UNKNOWN))
                .addAggregation(createAggregation(TERMS_PUBLISHER_COUNT, FIELD_PUBLISHER_NAME, UNKNOWN))
                .addAggregation(createAggregation("provenanceCount", "provenance.code.raw", UNKNOWN))
                .addAggregation(createAggregation("orgPath", "publisher.orgPath", UNKNOWN))
                .addAggregation(temporalAggregation("firstHarvested", "harvest.firstHarvested"))
                .addAggregation(AggregationBuilders.missing("missingFirstHarvested").field("harvest.firstHarvested"))
                .addAggregation(temporalAggregation("lastChanged", "harvest.lastChanged"))
                .addAggregation(AggregationBuilders.missing("missingLastChanged").field("harvest.lastChanged"))
                .addAggregation(createAggregation("spatial", "spatial.prefLabel.no.raw", UNKNOWN));

        logger.trace("Query: {}", searchBuilder.toString());

        if (emptySearch) {
            addSortForEmptySearch(searchBuilder);
        }

        // Handle attempting to sort on score, because any sorting removes score i.e. relevance from the search.
        if (sortfield.compareTo("score") != 0) {
            addSort(sortfield, sortdirection, searchBuilder);
        }

        // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: " + response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

    private void addSortForEmptySearch(SearchRequestBuilder searchBuilder) {

        SortBuilder sortFieldProvenance = SortBuilders.fieldSort("provenanceSort")
                .order(SortOrder.ASC);

        SortBuilder sortOnSource = SortBuilders.fieldSort("source")
                .order(SortOrder.ASC);

        SortBuilder sortOnLastChanged = SortBuilders.fieldSort("harvest.lastChanged")
                .order(SortOrder.DESC);


        searchBuilder.addSort(sortFieldProvenance).addSort(sortOnSource).addSort(sortOnLastChanged);
    }

    private boolean isEmpty(String value) {
        return value == null || value.isEmpty();
    }

    AggregationBuilder temporalAggregation(String name, String dateField) {

        return AggregationBuilders.filters(name)
                .filter("last7days", temporalRangeFromXdaysToNow(7, dateField))
                .filter("last30days", temporalRangeFromXdaysToNow(30, dateField))
                .filter("last365days", temporalRangeFromXdaysToNow(365, dateField));
    }


    RangeQueryBuilder temporalRangeFromXdaysToNow(int days, String dateField) {
        long now = new Date().getTime();

        return QueryBuilders.rangeQuery(dateField).from(now - days * DAY_IN_MS).to(now).format("epoch_millis");
    }

    RangeQueryBuilder temporalRangeBefore(int days, String dateField) {
        return QueryBuilders.rangeQuery(dateField).lte("now-" + days + "d/d");
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

        if (size < 0) {
            return 0;
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
    private BoolQueryBuilder addFilter(String theme, String publisher, String accessRights,
                                       QueryBuilder search, String orgPath,
                                       int firstHarvested, int lastHarvested, int lastChanged,
                                       String subject, String provenance, String spatial) {

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(search);


        // theme can contain multiple themes, example: AGRI,HEAL
        if (!StringUtils.isEmpty(theme)) {
            BoolQueryBuilder themeFilter = QueryBuilders.boolQuery();

            for (String t : theme.split(",")) {
                if (t.equals(UNKNOWN)) {
                    themeFilter.mustNot(QueryBuilders.existsQuery("theme.code"));
                } else {
                    themeFilter.must(QueryBuilders.termQuery("theme.code", t));
                }
            }

            boolQuery.filter(themeFilter);
        }

        if (!StringUtils.isEmpty(publisher)) {
            BoolQueryBuilder publisherFilter = QueryBuilders.boolQuery();

            if (publisher.equals(UNKNOWN)) {
                publisherFilter.mustNot(QueryBuilders.existsQuery("publisher.name"));
            } else {
                publisherFilter.must(QueryBuilders.termQuery("publisher.name.raw", publisher));
            }

            boolQuery.filter(publisherFilter);
        }

        if (!StringUtils.isEmpty(accessRights)) {
            BoolQueryBuilder accessRightsFilter = QueryBuilders.boolQuery();
            if (accessRights.equals(UNKNOWN)) {
                accessRightsFilter.mustNot(QueryBuilders.existsQuery("accessRights"));
            } else {
                accessRightsFilter.must(QueryBuilders.termQuery("accessRights.code.raw", accessRights));
            }

            boolQuery.filter(accessRightsFilter);
        }

        if (!StringUtils.isEmpty(orgPath)) {
            BoolQueryBuilder orgPathFilter = QueryBuilders.boolQuery();
            orgPathFilter.must(QueryBuilders.termQuery("publisher.orgPath", orgPath));
            boolQuery.filter(orgPathFilter);
        }

        if (firstHarvested > 0) {
            BoolQueryBuilder firstHarvestedFilter = QueryBuilders.boolQuery();
            firstHarvestedFilter.must(temporalRangeFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
            boolQuery.filter(firstHarvestedFilter);
        }

        if (lastHarvested > 0) {
            BoolQueryBuilder lastHarvestedFilter = QueryBuilders.boolQuery();
            lastHarvestedFilter.must(temporalRangeBefore(lastHarvested, "harvest.lastHarvested"));

            boolQuery.filter(lastHarvestedFilter);
        }

        if (lastChanged > 0) {
            BoolQueryBuilder lastChangedFilter = QueryBuilders.boolQuery();
            lastChangedFilter.must(temporalRangeFromXdaysToNow(lastChanged, "harvest.lastChanged"));
            boolQuery.filter(lastChangedFilter);
        }

        if (!StringUtils.isEmpty(subject)) {
            BoolQueryBuilder subjectFilter = QueryBuilders.boolQuery();

            Arrays.stream(subject.split(",")).forEach( subj -> {
                if (subj.equals(UNKNOWN)){
                    subjectFilter.mustNot(QueryBuilders.existsQuery("subject"));
                } else if (subj.startsWith("http")) {
                    subjectFilter.must(QueryBuilders.matchQuery("subject.uri", subj));
                } else {
                    subjectFilter.must(QueryBuilders.termQuery("subject.prefLabel.no.raw", subj));
                }
            });
            boolQuery.filter(subjectFilter);
        }

        if (!StringUtils.isEmpty(provenance)) {
            BoolQueryBuilder provenanceFilter = QueryBuilders.boolQuery();

            if (provenance.equals(UNKNOWN)) {
                provenanceFilter.mustNot(QueryBuilders.existsQuery("provenance"));
            } else {
                provenanceFilter.must(QueryBuilders.termQuery("provenance.code.raw", provenance));
            }

            boolQuery.filter(provenanceFilter);
        }

        if (!StringUtils.isEmpty(spatial)) {
            BoolQueryBuilder spatialFilter = QueryBuilders.boolQuery();

            Arrays.stream(spatial.split(",")).forEach(spatialLabel -> {
                if (spatialLabel.equals(UNKNOWN)) {
                    spatialFilter.mustNot(QueryBuilders.existsQuery("spatial"));
                } else if (spatialLabel.startsWith("http")) {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.uri", spatialLabel));
                } else {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.prefLabel.no.raw", spatialLabel));
                }
            });

            boolQuery.filter(spatialFilter);
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
    @ApiOperation(value = "gets a specific dataset",
            notes = "You must specify the dataset's identifier", response = Dataset.class)
    @RequestMapping(value = "/datasets/**", method = RequestMethod.GET, produces = {"application/json", "text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> detail(HttpServletRequest request) {
        ResponseEntity<String> jsonError = initializeElasticsearchTransportClient();

        String id = extractIdentifier(request);

        logger.info("request for {}", id);
        try {
            id = URLDecoder.decode(id, "utf-8");
        } catch (UnsupportedEncodingException e) {
            logger.warn("id could not be decoded {}. Reason {}", id, e.getLocalizedMessage());
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
            ResponseEntity<String> rdfResponse = produceRDFResponse(id, response, acceptHeader);
            if (rdfResponse != null) return rdfResponse;
        }

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    private ResponseEntity<String> produceRDFResponse(String id, SearchResponse response, String acceptHeader) {
        try {
            String datasetAsJson = response.getHits().getAt(0).getSourceAsString();

            ResponseEntity<String> rdfResponse = getRdfResponse(datasetAsJson, acceptHeader);
            if (rdfResponse != null) return rdfResponse;
        } catch (Exception e) {
            logger.warn("Unable to return rdf for {}. Reason {}", id, e.getLocalizedMessage());
        }
        return null;
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
        String id = request.getServletPath().replaceFirst("/datasets/", "");
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
    @ApiOperation(value = "aggregate dataset count per theme", notes = "Returns a list of themes and the total number of datasets for each of them",
            response = SkosConcept.class)
    @RequestMapping(value = QUERY_THEME_COUNT, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> themecount(@RequestParam(value = "code", defaultValue = "", required = false) String themecode) {
        return aggregateOnField(FIELD_THEME_CODE, themecode, TERMS_THEME_COUNT, UNKNOWN);
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
    @ApiOperation(value = "aggregate dataset count per publisher",
            notes = "Returns a list of publishers and the total number of dataset for each of them")
    @RequestMapping(value = QUERY_PUBLISHER_COUNT, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> publisherCount(@RequestParam(value = "publisher", defaultValue = "", required = false) String publisher) {
        return aggregateOnField(FIELD_PUBLISHER_NAME, publisher, TERMS_PUBLISHER_COUNT, UNKNOWN);
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
    @ApiOperation(value = "aggregatds dataset count per organization path")
    @RequestMapping(value = AGGREGATE_DATASET, method = RequestMethod.GET, produces = "application/json")
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
                .addAggregation(createAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL, UNKNOWN))
                .addAggregation(createAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE, UNKNOWN))
                .addAggregation(createAggregation(TERMS_PUBLISHER_COUNT, FIELD_PUBLISHER_NAME, UNKNOWN))
                .addAggregation(createAggregation("orgPath", "publisher.orgPath", UNKNOWN))
                .addAggregation(temporalAggregation("firstHarvested", "harvest.firstHarvested"))
                .addAggregation(AggregationBuilders.missing("missingFirstHarvested").field("harvest.firstHarvested"))
                .addAggregation(temporalAggregation("lastChanged", "harvest.lastChanged"))
                .addAggregation(AggregationBuilders.missing("missingLastChanged").field("harvest.lastChanged"))
                .addAggregation(datasetsWithDistribution)
                .addAggregation(openDatasetsWithDistribution)
                .addAggregation(datasetsWithSubject);

        // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: " + response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

}
