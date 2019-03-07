package no.fdk.searchapi.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.fdk.searchapi.ElasticsearchService;
import no.dcat.shared.Dataset;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.*;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsSearchController {
    public static final String MISSING = "Ukjent";
    public static final String INDEX_DCAT = "dcat";
    public static final String FIELD_THEME_CODE = "theme.code";
    public static final String FIELD_ACCESS_RIGHTS_PREFLABEL = "accessRights.code.raw";
    public static final String FIELD_SUBJECTS_PREFLABEL = "subject.prefLabel.no";
    public static final String TERMS_THEME_COUNT = "theme_count";
    public static final String TERMS_ACCESS_RIGHTS_COUNT = "accessRightsCount";
    public static final String TERMS_SUBJECTS_COUNT = "subjectsCount";
    public static final String AGGREGATE_DATASET = "/aggregateDataset";
    public static final long DAY_IN_MS = 1000 * 3600 * 24;
    /* api names */
    public static final String QUERY_SEARCH = "/datasets";
    private static final int MAX_AGGREGATIONS = 10000; //be sure all theme counts are returned
    private static Logger logger = LoggerFactory.getLogger(DatasetsSearchController.class);
    private ElasticsearchService elasticsearch;

    @Autowired
    public DatasetsSearchController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @return List of  elasticsearch records.
     */
    @CrossOrigin
    @ApiOperation(value = "Queries the catalog for datasets.",
        notes = "Returns a list of matching datasets wrapped in a elasticsearch response. " +
            "Max number returned by a single query is 100. Size parameters greater than 100 will not return more than 100 datasets. " +
            "In order to access all datasets, use multiple queries and increment from parameter.", response = Dataset.class)
    @RequestMapping(value = QUERY_SEARCH, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> search(
        @ApiParam("Full content search")
        @RequestParam(value = "q", defaultValue = "", required = false)
            String query,

        @ApiParam("Title search")
        @RequestParam(value = "title", defaultValue = "", required = false)
            String title,

        @ApiParam("Filters on specified theme(s). ex. GOVE, or GOVE,SOCI")
        @RequestParam(value = "theme", defaultValue = "", required = false)
            String theme,

        @ApiParam("Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC ")
        @RequestParam(value = "accessrights", defaultValue = "", required = false)
            String accessRights,

        @ApiParam("Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238")
        @RequestParam(value = "orgPath", defaultValue = "", required = false)
            String orgPath,

        @ApiParam("Filters datasets that were first harvested x-days ago, e.g. a value of 100 will result in datasets that were harvested more than 100 days ago")
        @RequestParam(value = "firstHarvested", defaultValue = "0", required = false)
            int firstHarvested,

        @ApiParam("Specifies the language elements of the datasets to search in, default is nb")
        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @ApiParam("Specifies the sort field, at the present we support title, modified and publisher. Default is no value")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "", required = false)
            String sortdirection,

        @ApiParam("Filters datasets according to their provenance code, e.g. NASJONAL - nasjonal building block, VEDTAK - governmental decisions, BRUKER - user collected data and TREDJEPART - third party data")
        @RequestParam(value = "provenance", defaultValue = "", required = false)
            String provenance,

        @ApiParam("Filters datasets according to their spatial label, e.g. Oslo, Norge")
        @RequestParam(value = "spatial", defaultValue = "", required = false)
            String spatial,

        @ApiParam("Filters on distribution license and access rights. If true the distribution licence is open and the access rights are public.")
        @RequestParam(value = "opendata", defaultValue = "", required = false)
            String opendata,

        @ApiParam("Filters on catalog uri.")
        @RequestParam(value = "catalog", defaultValue = "", required = false)
            String catalog,

        @ApiParam("Comma separated list of which fields should be returned. E.g id,uri,harvest,publisher")
        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

        @ApiParam("Include aggregations")
        @RequestParam(value = "aggregations", defaultValue = "true", required = false)
            String aggregations,

        @PageableDefault()
            Pageable pageable
    ) {

        StringBuilder loggMsg = new StringBuilder()
            .append(" query:").append(query)
            .append(" title:").append(title)
            .append(" theme:").append(theme)
            .append(" accessRights:").append(accessRights)
            .append(" orgPath:").append(orgPath)
            .append(" firstHarvested:").append(firstHarvested)
            .append(" offset:").append(pageable.getOffset())
            .append(" size:").append(pageable.getPageSize())
            .append(" lang:").append(lang)
            .append(" sortfield:").append(sortfield)
            .append(" sortdirection:").append(sortdirection)
            .append(" provenance:").append(provenance)
            .append(" spatial:").append(spatial)
            .append(" opendata: ").append(opendata)
            .append(" returnfields: ").append(returnFields);

        logger.debug(loggMsg.toString());

        String themeLanguage = "*";
        String analyzerLang = "norwegian";

        if ("en".equals(lang)) {
            //themeLanguage="en";
            analyzerLang = "english";
        }
        lang = "*"; // hardcode to search in all language fields

        int from = checkAndAdjustFrom((int) pageable.getOffset());
        int size = checkAndAdjustSize(pageable.getPageSize());

        QueryBuilder searchQuery;

        if (!StringUtils.isEmpty(title)) {
            QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("title.nb", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("title.no", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("title.nn", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("title.en", title).analyzer("english").maxExpansions(15);
            searchQuery = QueryBuilders.boolQuery().should(nbQuery).should(noQuery).should(nnQuery).should(enQuery);
        } else if (!StringUtils.isEmpty(query)) {
            // add * if query only contains one word
            if (!query.contains(" ")) {
                query = query + " " + query + "*";
            }
            searchQuery = QueryBuilders.simpleQueryStringQuery(query)
                .analyzer(analyzerLang)
                .field("title" + "." + lang).boost(3f)
                .field("objective" + "." + lang)
                .field("keyword" + "." + lang).boost(2f)
                .field("theme.title" + "." + themeLanguage)
                .field("description" + "." + lang)
                .field("publisher.name").boost(3f)
                .field("publisher.prefLabel." + lang).boost(3f)
                .field("accessRights.prefLabel" + "." + lang)
                .field("accessRights.code")
                .field("subject.prefLabel." + lang)
                .field("subject.altLabel." + lang)
                .field("subject.definition." + lang)
                .defaultOperator(Operator.OR);
        } else {
            searchQuery = QueryBuilders.matchAllQuery();
        }

        BoolQueryBuilder composedQuery = QueryBuilders.boolQuery().must(searchQuery);

        // Adding constant "should" term increases score for matching documents for national components
        // in api-cat, we use modern notation nationalComponent=true, while in dataset is not as explicit
        composedQuery.should(QueryUtil.createTermQuery("provenance.code.raw", "NASJONAL").boost(2));

        // add filters

        // theme can contain multiple themes, example: AGRI,HEAL
        if (!StringUtils.isEmpty(theme)) {
            String[] themes = theme.split(",");
            composedQuery.filter(QueryUtil.createTermsQuery("theme.code", themes));
        }

        if (!StringUtils.isEmpty(catalog)) {
            composedQuery.filter(QueryUtil.createTermQuery("catalog.uri", catalog));
        }


        if (!StringUtils.isEmpty(accessRights)) {
            composedQuery.filter(QueryUtil.createTermQuery("accessRights.code.raw", accessRights));
        }
        if (!StringUtils.isEmpty(opendata)) {
            BoolQueryBuilder opendataFilter = QueryBuilders.boolQuery();
            if (opendata.equals("true")) {
                opendataFilter.must(QueryBuilders.termQuery("distribution.openLicense", "true"));
                opendataFilter.must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"));
            }
            //Handle the negative cases
            else if (opendata.equals("false")) {
                BoolQueryBuilder notOpenLicenseFilter = QueryBuilders.boolQuery();
                BoolQueryBuilder notOpenDistributionFilter = QueryBuilders.boolQuery();
                notOpenLicenseFilter.mustNot(QueryBuilders.termQuery("distribution.openLicense", "true"));
                notOpenDistributionFilter.mustNot(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"));
                opendataFilter.should(notOpenLicenseFilter);
                opendataFilter.should(notOpenDistributionFilter);
            }
            composedQuery.filter(opendataFilter);
        }

        if (!StringUtils.isEmpty(orgPath)) {
            composedQuery.filter(QueryUtil.createTermQuery("publisher.orgPath", orgPath));
        }

        if (firstHarvested > 0) {
            composedQuery.filter(QueryUtil.createRangeQueryFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
        }

        if (!StringUtils.isEmpty(provenance)) {
            composedQuery.filter(QueryUtil.createTermQuery("provenance.code.raw", accessRights));
        }

        if (!StringUtils.isEmpty(spatial)) {
            BoolQueryBuilder spatialFilter = QueryBuilders.boolQuery();

            String[] spatials = spatial.split(",");
            Arrays.stream(spatials).forEach(spatialLabel -> {
                if (spatialLabel.equals(MISSING)) {
                    spatialFilter.mustNot(QueryBuilders.existsQuery("spatial"));
                } else if (spatialLabel.startsWith("http")) {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.uri", spatialLabel));
                } else {
                    spatialFilter.must(QueryBuilders.termQuery("spatial.prefLabel.no.raw", spatialLabel));
                }
            });

            composedQuery.filter(spatialFilter);
        }

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch("dcat");
        searchBuilder
            .setTypes("dataset")
            .setQuery(composedQuery)
            .setFrom(from)
            .setSize(size);

        if ("true".equals(aggregations)) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation(TERMS_SUBJECTS_COUNT, FIELD_SUBJECTS_PREFLABEL))
                .addAggregation(QueryUtil.createTermsAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL))
                .addAggregation(QueryUtil.createTermsAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE))
                .addAggregation(QueryUtil.createTermsAggregation("catalogs", "catalog.uri"))
                .addAggregation(QueryUtil.createTermsAggregation("provenanceCount", "provenance.code.raw"))
                .addAggregation(QueryUtil.createTermsAggregation("orgPath", "publisher.orgPath"))
                .addAggregation(QueryUtil.createTemporalAggregation("firstHarvested", "harvest.firstHarvested"))
                .addAggregation(AggregationBuilders.missing("missingFirstHarvested").field("harvest.firstHarvested"))
                .addAggregation(QueryUtil.createTemporalAggregation("lastChanged", "harvest.lastChanged"))
                .addAggregation(AggregationBuilders.missing("missingLastChanged").field("harvest.lastChanged"))
                .addAggregation(QueryUtil.createTermsAggregation("spatial", "spatial.prefLabel.no.raw"))
                .addAggregation(getOpendataAggregation());
        }

        if (!StringUtils.isEmpty(returnFields)) {
            searchBuilder.setFetchSource(returnFields.split(","), null);
        }

        if ("modified".equals(sortfield)) {
            SortOrder sortOrder = "asc".equals(sortdirection.toLowerCase()) ? SortOrder.ASC : SortOrder.DESC;

            SortBuilder sortBuilder = SortBuilders.fieldSort("harvest.firstHarvested")
                .order(sortOrder)
                .missing("_last");

            logger.debug("sort: {}", sortBuilder.toString());
            searchBuilder.addSort(sortBuilder);
        }

        // Execute search
        logger.trace("Executing query: {}", searchBuilder.toString());
        SearchResponse response = searchBuilder.execute().actionGet();
        logger.trace("Search response: {}", response.toString());

        // return response
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    /**
     * Aggregation based on orgPath.
     *
     * @param query the first part or complete orgPath
     * @return the aggregations of datasets with terms, accessRights, subjects, publishers, orgPath and distributions
     */

    @CrossOrigin
    @ApiOperation(value = "Aggregates dataset count per organization path.")
    @RequestMapping(value = AGGREGATE_DATASET, method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> aggregateDatasets(@RequestParam(value = "q", defaultValue = "") String query) {

        logger.info("{} of {}", AGGREGATE_DATASET, query);

        QueryBuilder search;

        if ("".equals(query)) {
            search = QueryBuilders.matchAllQuery();
        } else {
            search = QueryBuilders.termQuery("publisher.orgPath", query);
        }

        logger.trace(search.toString());

        AggregationBuilder datasetsWithDistribution = AggregationBuilders.filter("distCount", QueryBuilders.existsQuery("distribution"));

        AggregationBuilder openDatasetsWithDistribution = AggregationBuilders.filter("distOnPublicAccessCount",
            QueryBuilders.boolQuery()
                .must(QueryBuilders.existsQuery("distribution"))
                .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
        );

        AggregationBuilder datasetsWithSubject = AggregationBuilders.filter("subjectCount", QueryBuilders.existsQuery("subject.prefLabel"));

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch(INDEX_DCAT)
            .setTypes("dataset")
            .setQuery(search)
            .setSize(0)
            .addAggregation(QueryUtil.createTermsAggregation(TERMS_ACCESS_RIGHTS_COUNT, FIELD_ACCESS_RIGHTS_PREFLABEL))
            .addAggregation(QueryUtil.createTermsAggregation(TERMS_THEME_COUNT, FIELD_THEME_CODE))
            .addAggregation(QueryUtil.createTermsAggregation("orgPath", "publisher.orgPath"))
            .addAggregation(QueryUtil.createTermsAggregation("catalogs", "catalog.uri"))
            .addAggregation(QueryUtil.createTemporalAggregation("firstHarvested", "harvest.firstHarvested"))
            .addAggregation(AggregationBuilders.missing("missingFirstHarvested").field("harvest.firstHarvested"))
            .addAggregation(QueryUtil.createTemporalAggregation("lastChanged", "harvest.lastChanged"))
            .addAggregation(AggregationBuilders.missing("missingLastChanged").field("harvest.lastChanged"))
            .addAggregation(datasetsWithDistribution)
            .addAggregation(openDatasetsWithDistribution)
            .addAggregation(datasetsWithSubject)
            .addAggregation(getOpendataAggregation());

        // Execute search
        SearchResponse response = searchBuilder.execute().actionGet();

        logger.trace("Search response: " + response.toString());

        // return response
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }


    public AggregationBuilder getOpendataAggregation() {
        return AggregationBuilders.filter("opendata",
            QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
                .must(QueryBuilders.termQuery("distribution.openLicense", "true"))
        );
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

    static class QueryUtil {
        static QueryBuilder createTermQuery(String term, String value) {
            return value.equals(MISSING) ?
                QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)) :
                QueryBuilders.termQuery(term, value);
        }

        static QueryBuilder createTermsQuery(String term, String[] values) {
            BoolQueryBuilder composedQuery = QueryBuilders.boolQuery();
            for (String value : values) {
                if (value.equals(MISSING)) {
                    composedQuery.filter(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)));
                } else {
                    composedQuery.filter(QueryBuilders.termQuery(term, value));
                }
            }
            return composedQuery;
        }

        static RangeQueryBuilder createRangeQueryFromXdaysToNow(int days, String dateField) {
            long now = new Date().getTime();

            return QueryBuilders.rangeQuery(dateField).from(now - days * DAY_IN_MS).to(now).format("epoch_millis");
        }

        static AggregationBuilder createTermsAggregation(String aggregationName, String field) {
            return AggregationBuilders
                .terms(aggregationName)
                .missing(MISSING)
                .field(field)
                .size(MAX_AGGREGATIONS)
                .order(Terms.Order.count(false));
        }

        static AggregationBuilder createTemporalAggregation(String name, String dateField) {

            return AggregationBuilders.filters(name,
                new FiltersAggregator.KeyedFilter("last7days", QueryUtil.createRangeQueryFromXdaysToNow(7, dateField)),
                new FiltersAggregator.KeyedFilter("last30days", QueryUtil.createRangeQueryFromXdaysToNow(30, dateField)),
                new FiltersAggregator.KeyedFilter("last365days", QueryUtil.createRangeQueryFromXdaysToNow(365, dateField)));
        }
    }
}
