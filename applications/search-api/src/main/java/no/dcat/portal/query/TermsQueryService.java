package no.dcat.portal.query;


import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.dcat.shared.Subject;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
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


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
  public class TermsQueryService extends ElasticsearchService {
    public static final String SUBJECT_INDEX = "scat";

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
    @ApiOperation(value = "Query for terms (concepts).",
            notes = "Returns the elasticsearch response with matching terms (dct:subject)", response = Subject.class)
    @RequestMapping(value = QUERY_SEARCH, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> search(
            @ApiParam("The query to match a concept")
            @RequestParam(value = "q", defaultValue = "", required = false) String query,

            @ApiParam("Search for the creator (owner) of the term")
            @RequestParam(value = "creator", defaultValue = "", required = false) String creator,

            @ApiParam(value = "Search for concepts based on orgpath", example = "/STAT")
            @RequestParam(value = "orgPath", defaultValue = "", required = false) String orgPath,

            @ApiParam("The index position of the result set to start return concepts for")
            @RequestParam(value = "from", defaultValue = "0", required = false) int from,

            @ApiParam("The size of the result set")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,

            @ApiParam("The language to search in")
            @RequestParam(value = "lang", defaultValue = "nb", required = false) String lang) {

        StringBuilder loggMsg = new StringBuilder()
                .append("query: ").append(query)
                .append(" creator: ").append(creator)
                .append(" orgPath: ").append(orgPath)
                .append(" from:").append(from)
                .append(" size:").append(size)
                .append(" lang:").append(lang);

        logger.info(loggMsg.toString());

        String analyzerLang = "norwegian";

        if ("en".equals(lang)) {
            analyzerLang = "english";
        }
        lang = "*"; // hardcode to search in all language fields

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
                    .field("note" + "." + lang)
                    .field("datasets.title.*")
                    .field("datasets.description.*")
            ;
        }

        logger.trace(search.toString());

        BoolQueryBuilder boolQuery = addFilter(search, creator, orgPath);

        // Execute search
        SearchResponse response = doSearch(boolQuery, from, size);

        logger.trace("Search response: {}", response.toString());

        // return response
        return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
    }

    private BoolQueryBuilder addFilter(QueryBuilder search, String creator, String orgPath) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(search);

        if (!StringUtils.isEmpty(creator)) {
            BoolQueryBuilder boolFilterPublisher = QueryBuilders.boolQuery();
            if (creator.toLowerCase().equals("ukjent")) {
                boolFilterPublisher.mustNot(QueryBuilders.existsQuery("creator.name.raw"));
            } else {
                boolFilterPublisher.must(QueryBuilders.termQuery("creator.name.raw", creator));
            }

            boolQuery.filter(boolFilterPublisher);
        }

        if (!StringUtils.isEmpty(orgPath)) {
            BoolQueryBuilder orgPathFilter = QueryBuilders.boolQuery();
            orgPathFilter.must(QueryBuilders.termQuery("creator.orgPath", orgPath));
            boolQuery.filter(orgPathFilter);
        }

        return boolQuery;

    }


    SearchResponse doSearch(QueryBuilder search, int from, int size) {
        AggregationBuilder aggregateCreatorNames = AggregationBuilders
                .terms("creator")
                .missing("ukjent")
                .field("creator.name.raw")
                .size(AGGREGATION_NUMBER_OF_COUNTS)
                .order(Order.count(false));

        AggregationBuilder aggregateOrgPath = AggregationBuilders
                .terms("orgPath")
                .missing("ukjent")
                .field("creator.orgPath")
                .size(AGGREGATION_NUMBER_OF_COUNTS)
                .order(Order.count(false));

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = getClient().prepareSearch(SUBJECT_INDEX)
                .setTypes("subject")
                .setQuery(search)
                .setFrom(from)
                .setSize(size)
                .addAggregation(aggregateCreatorNames)
                .addAggregation(aggregateOrgPath);

        return searchBuilder.execute().actionGet();
    }

}
