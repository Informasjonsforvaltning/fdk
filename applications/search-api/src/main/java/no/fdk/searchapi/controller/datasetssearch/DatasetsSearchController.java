package no.fdk.searchapi.controller.datasetssearch;

import com.google.common.collect.ImmutableMap;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.dcat.shared.Dataset;
import no.fdk.searchapi.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.*;
import org.elasticsearch.script.Script;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.sum.SumAggregationBuilder;
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
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;

import static java.lang.Integer.MAX_VALUE;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.elasticsearch.script.Script.DEFAULT_SCRIPT_LANG;
import static org.elasticsearch.script.ScriptType.INLINE;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsSearchController {
    public static final String MISSING = "Ukjent";
    public static final long DAY_IN_MS = 1000 * 3600 * 24;
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
    @RequestMapping(value = "/datasets", method = RequestMethod.GET, produces = "application/json")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "q", dataType = "string", paramType = "query", value = "Full content search"),
        @ApiImplicitParam(name = "title", dataType = "string", paramType = "query", value = "Title search"),
        @ApiImplicitParam(name = "theme", dataType = "string", paramType = "query", value = "Filters on specified theme(s). ex. GOVE, or GOVE,SOCI"),
        @ApiImplicitParam(name = "accessrights", dataType = "string", paramType = "query", value = "Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC"),
        @ApiImplicitParam(name = "orgPath", dataType = "string", paramType = "query", value = "Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238"),
        @ApiImplicitParam(name = "firstHarvested", dataType = "string", paramType = "query", defaultValue = "0", value = "Filters datasets that were first harvested x-days ago, e.g. a value of 100 will result in datasets that were harvested more than 100 days ago"),
        @ApiImplicitParam(name = "provenance", dataType = "string", paramType = "query", value = "Filters datasets according to their provenance code, e.g. NASJONAL - nasjonal building block, VEDTAK - governmental decisions, BRUKER - user collected data and TREDJEPART - third party data"),
        @ApiImplicitParam(name = "spatial", dataType = "string", paramType = "query", value = "Filters datasets according to their spatial label, e.g. Oslo, Norge"),
        @ApiImplicitParam(name = "opendata", dataType = "string", paramType = "query", value = "Filters on distribution license and access rights. If true the distribution licence is open and the access rights are public."),
        @ApiImplicitParam(name = "catalog", dataType = "string", paramType = "query", value = "Filters on catalog uri."),
        @ApiImplicitParam(name = "page", dataType = "string", paramType = "query", defaultValue = "0", value = "Page index. First page is 0"),
        @ApiImplicitParam(name = "size", dataType = "string", paramType = "query", defaultValue = "10", value = "Page size")
    })
    public ResponseEntity<String> search(
        @ApiParam(hidden = true)
        @RequestParam Map<String, String> params,

        @ApiParam("Specifies the language elements of the datasets to search in, default is nb")
        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @ApiParam("Specifies the sort field. The only allowed value is \"modified\". Default is no value")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "desc", required = false)
            String sortdirection,

        @ApiParam("Comma separated list of which fields should be returned. E.g id,uri,harvest,publisher")
        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

        @ApiParam("Include aggregations")
        @RequestParam(value = "aggregations", defaultValue = "", required = false)
            String aggregations,

        @PageableDefault()
            Pageable pageable
    ) {
        logger.debug("GET /datasets?{}", params);

        int from = checkAndAdjustFrom((int) pageable.getOffset());
        int size = checkAndAdjustSize(pageable.getPageSize());

        BoolQueryBuilder composedQuery = QueryBuilders.boolQuery();

        // Default query is to match all. User defined filters will narrow it down.
        composedQuery = composedQuery.must(QueryBuilders.matchAllQuery());

        // Adding constant "should" term increases score for matching documents for national components
        // in api-cat, we use modern notation nationalComponent=true, while in dataset is not as explicit
        composedQuery = composedQuery.should(QueryUtil.createTermQuery("provenance.code.raw", "NASJONAL").boost(2));

        composedQuery = addFilters(composedQuery, params, lang);

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch("dcat");
        searchBuilder
            .setTypes("dataset")
            .setQuery(composedQuery)
            .setFrom(from)
            .setSize(size);

        if (isNotEmpty(aggregations)) {
            searchBuilder = addAggregations(searchBuilder, aggregations);
        }

        if (isNotEmpty(returnFields)) {
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

    BoolQueryBuilder addFilters(BoolQueryBuilder composedQuery, Map<String, String> params, String lang) {

        String title = params.getOrDefault("title", "");
        if (isNotEmpty(title)) {
            QueryBuilder nbQuery = QueryBuilders.matchPhrasePrefixQuery("title.nb", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder noQuery = QueryBuilders.matchPhrasePrefixQuery("title.no", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder nnQuery = QueryBuilders.matchPhrasePrefixQuery("title.nn", title).analyzer("norwegian").maxExpansions(15);
            QueryBuilder enQuery = QueryBuilders.matchPhrasePrefixQuery("title.en", title).analyzer("english").maxExpansions(15);
            composedQuery.must(QueryBuilders.boolQuery().should(nbQuery).should(noQuery).should(nnQuery).should(enQuery));
        }

        String query = params.getOrDefault("q", "");
        if (isNotEmpty(query)) {
            // add * if query only contains one word
            if (!query.contains(" ")) {
                query = query + " " + query + "*";
            }
            composedQuery.must(QueryBuilders.simpleQueryStringQuery(query)
                .analyzer(("en".equals(lang)) ? "english" : "norwegian")
                .field("title.*").boost(3f)
                .field("objective.*")
                .field("keyword.*").boost(2f)
                .field("theme.title.*")
                .field("description.*")
                .field("publisher.name").boost(3f)
                .field("publisher.prefLabel.*").boost(3f)
                .field("accessRights.prefLabel.*")
                .field("accessRights.code")
                .field("subject.prefLabel.*")
                .field("subject.altLabel.*")
                .field("subject.definition.*")
                .defaultOperator(Operator.OR));
        }

        String theme = params.getOrDefault("theme", "");
        // theme can contain multiple themes, example: AGRI,HEAL
        if (isNotEmpty(theme)) {
            String[] themes = theme.split(",");
            composedQuery.filter(QueryUtil.createTermsQuery("theme.code", themes));
        }

        String catalog = params.getOrDefault("catalog", "");
        if (isNotEmpty(catalog)) {
            composedQuery.filter(QueryUtil.createTermQuery("catalog.uri", catalog));
        }

        String accessRights = params.getOrDefault("accessrights", "");
        if (isNotEmpty(accessRights)) {
            composedQuery.filter(QueryUtil.createTermQuery("accessRights.code.raw", accessRights));
        }
        String opendata = params.getOrDefault("opendata", "");
        if (isNotEmpty(opendata)) {
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

        String orgPath = params.getOrDefault("orgPath", "");
        if (isNotEmpty(orgPath)) {
            composedQuery.filter(QueryUtil.createTermQuery("publisher.orgPath", orgPath));
        }

        int firstHarvested = Integer.parseInt(params.getOrDefault("firstHarvested", "0"));
        if (firstHarvested > 0) {
            composedQuery.filter(QueryUtil.createRangeQueryFromXdaysToNow(firstHarvested, "harvest.firstHarvested"));
        }

        String provenance = params.getOrDefault("provenance", "");
        if (isNotEmpty(provenance)) {
            composedQuery.filter(QueryUtil.createTermQuery("provenance.code.raw", accessRights));
        }

        String spatial = params.getOrDefault("spatial", "");
        if (isNotEmpty(spatial)) {
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
        return composedQuery;
    }

    public SearchRequestBuilder addAggregations(SearchRequestBuilder searchBuilder, String aggregationFields) {
        HashSet<String> selectedAggregationFields = new HashSet<>(Arrays.asList(aggregationFields.split(",")));

        if (selectedAggregationFields.contains("accessRights")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("accessRights", "accessRights.code.raw"));
        }
        if (selectedAggregationFields.contains("theme")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("theme", "theme.code"));
        }
        if (selectedAggregationFields.contains("orgPath")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("orgPath", "publisher.orgPath"));
        }
        if (selectedAggregationFields.contains("catalog")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("catalog", "catalog.uri"));
        }
        if (selectedAggregationFields.contains("provenance")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("provenance", "provenance.code.raw"));
        }
        if (selectedAggregationFields.contains("firstHarvested")) {
            searchBuilder.addAggregation(QueryUtil.createTemporalAggregation("firstHarvested", "harvest.firstHarvested"));
        }
        if (selectedAggregationFields.contains("spatial")) {
            searchBuilder.addAggregation(QueryUtil.createTermsAggregation("spatial", "spatial.prefLabel.no.raw"));
        }
        if (selectedAggregationFields.contains("opendata")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("opendata",
                QueryBuilders.boolQuery()
                    .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
                    .must(QueryBuilders.termQuery("distribution.openLicense", "true"))
            ));
        }
        if (selectedAggregationFields.contains("withDistribution")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("withDistribution", QueryBuilders.existsQuery("distribution")));
        }
        if (selectedAggregationFields.contains("publicWithDistribution")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("publicWithDistribution",
                QueryBuilders.boolQuery()
                    .must(QueryBuilders.existsQuery("distribution"))
                    .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
            ));
        }
        if (selectedAggregationFields.contains("nonpublicWithDistribution")) {

            searchBuilder.addAggregation(AggregationBuilders.filter("nonpublicWithDistribution",
                QueryBuilders.boolQuery()
                    .must(QueryBuilders.existsQuery("distribution"))
                    .mustNot(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
            ));
        }
        if (selectedAggregationFields.contains("publicWithoutDistribution")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("publicWithoutDistribution",
                QueryBuilders.boolQuery()
                    .mustNot(QueryBuilders.existsQuery("distribution"))
                    .must(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
            ));
        }
        if (selectedAggregationFields.contains("nonpublicWithoutDistribution")) {

            searchBuilder.addAggregation(AggregationBuilders.filter("nonpublicWithoutDistribution",
                QueryBuilders.boolQuery()
                    .mustNot(QueryBuilders.existsQuery("distribution"))
                    .mustNot(QueryBuilders.termQuery("accessRights.code.raw", "PUBLIC"))
            ));
        }
        if (selectedAggregationFields.contains("withSubject")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("withSubject", QueryBuilders.existsQuery("subject.prefLabel")));
        }
        if (selectedAggregationFields.contains("nationalComponent")) {
            searchBuilder.addAggregation(AggregationBuilders.filter("nationalComponent", QueryUtil.createTermQuery("provenance.code.raw", "NASJONAL")));
        }
        if (selectedAggregationFields.contains("subjects")) {
            searchBuilder.addAggregation(AggregationBuilders
                .terms("subjects")
                .field("subject.uri")
                .size(5)
                .order(Terms.Order.count(false)));
        }
        if (selectedAggregationFields.contains("distributionCountForTypeApi")) {
            searchBuilder.addAggregation(QueryUtil.createDistributionTypeCountAggregation("distributionCountForTypeApi", "API"));
        }
        if (selectedAggregationFields.contains("distributionCountForTypeFeed")) {
            searchBuilder.addAggregation(QueryUtil.createDistributionTypeCountAggregation("distributionCountForTypeFeed", "Feed"));
        }
        if (selectedAggregationFields.contains("distributionCountForTypeFile")) {
            searchBuilder.addAggregation(QueryUtil.createDistributionTypeCountAggregation("distributionCountForTypeFile", "Nedlastbar fil"));
        }

        return searchBuilder;
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
                .size(MAX_VALUE) //be sure all theme counts are returned
                .order(Terms.Order.count(false));
        }

        static AggregationBuilder createTemporalAggregation(String name, String dateField) {

            return AggregationBuilders.filters(name,
                new FiltersAggregator.KeyedFilter("last7days", QueryUtil.createRangeQueryFromXdaysToNow(7, dateField)),
                new FiltersAggregator.KeyedFilter("last30days", QueryUtil.createRangeQueryFromXdaysToNow(30, dateField)),
                new FiltersAggregator.KeyedFilter("last365days", QueryUtil.createRangeQueryFromXdaysToNow(365, dateField)));
        }

        static SumAggregationBuilder createDistributionTypeCountAggregation(String name, String type) {
            return AggregationBuilders.sum(name).script(new Script(
                INLINE,
                DEFAULT_SCRIPT_LANG,
                "int count = 0; " +
                    "if (params._source.distribution == null) return 0;" +
                    "for (int i = 0; i < params._source.distribution.length; ++i) { " +
                    "    if (params._source.distribution[i]['type'] == params.type) count++; " +
                    "} " +
                    "return count;",
                ImmutableMap.of("type", type)
            ));
        }

    }
}
