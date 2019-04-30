package no.fdk.searchapi.controller.datasetssearch;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.dcat.shared.Dataset;
import no.fdk.searchapi.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
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

import java.util.*;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsSearchController {
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
        @ApiImplicitParam(name = "losTheme", dataType = "string", paramType = "query", value = "Filters on spesificed los theme(s)."),
        @ApiImplicitParam(name = "accessrights", dataType = "string", paramType = "query", value = "Filters on accessrights, codes are PUBLIC, RESTRICTED or NON_PUBLIC"),
        @ApiImplicitParam(name = "orgPath", dataType = "string", paramType = "query", value = "Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238"),
        @ApiImplicitParam(name = "firstHarvested", dataType = "string", paramType = "query", defaultValue = "0", value = "Filters datasets that were first harvested x-days ago, e.g. a value of 100 will result in datasets that were harvested more than 100 days ago"),
        @ApiImplicitParam(name = "provenance", dataType = "string", paramType = "query", value = "Filters datasets according to their provenance code, e.g. NASJONAL - nasjonal building block, VEDTAK - governmental decisions, BRUKER - user collected data and TREDJEPART - third party data"),
        @ApiImplicitParam(name = "spatial", dataType = "string", paramType = "query", value = "Filters datasets according to their spatial label, e.g. Oslo, Norge"),
        @ApiImplicitParam(name = "opendata", dataType = "string", paramType = "query", value = "Filters on distribution license and access rights. If true the distribution licence is open and the access rights are public."),
        @ApiImplicitParam(name = "catalog", dataType = "string", paramType = "query", value = "Filters on catalog uri."),
        @ApiImplicitParam(name = "withDistributions", dataType = "string", paramType = "query", value = "Filters only datasets that have or have not distributions. Allowed values: \"true\", \"false\""),
        @ApiImplicitParam(name = "isPublic", dataType = "string", paramType = "query", value = "Filters only datasets that are public or not public. Allowed values: \"true\", \"false\""),
        @ApiImplicitParam(name = "withSubject", dataType = "string", paramType = "query", value = "Filters only datasets that have any related concepts. Allowed values: \"true\""),
        @ApiImplicitParam(name = "isNationalComponent", dataType = "string", paramType = "query", value = "Filters only datasets that are national compnents. Allowed values: \"true\""),
        @ApiImplicitParam(name = "subject", dataType = "string", paramType = "query", value = "Filters on concept uri."),
        @ApiImplicitParam(name = "distributionType", dataType = "string", paramType = "query", value = "Filters datasets that have a distribution of chosen type. Allowed values: \"API\",\"Feed\",\"Nedlastbar fil\" \""),
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

        QueryBuilder searchQuery = new DatasetsSearchQueryBuilder()
            .lang(lang)
            .boostNationalComponents()
            .addFilters(params)
            .build();

        // set up search query with aggregations
        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch("dcat")
            .setTypes("dataset")
            .setQuery(searchQuery)
            .setFrom(from)
            .setSize(size);


        if (isNotEmpty(aggregations)) {
            Set<String> selectedAggregationFields = new HashSet<>(Arrays.asList(aggregations.split(",")));
            DatasetsAggregations.buildAggregations(selectedAggregationFields).stream()
                .forEach(aggregation -> searchBuilder.addAggregation(aggregation));
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
        logger.debug("Executing query: {}", searchBuilder.toString());
        SearchResponse response = searchBuilder.execute().actionGet();
        logger.trace("Search response: {}", response.toString());

        // return response
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @ApiOperation(value = "Queries the catalog for datasets.",
        notes = "Returns a list of matching datasets wrapped in a elasticsearch response. " +
            "Max number returned by a single query is 100. Size parameters greater than 100 will not return more than 100 datasets. " +
            "In order to access all datasets, use multiple queries and increment from parameter.", response = Dataset.class)
    @RequestMapping(value = "/datasets/search", method = RequestMethod.POST, produces = "application/json")
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
        @ApiImplicitParam(name = "withDistributions", dataType = "string", paramType = "query", value = "Filters only datasets that have or have not distributions. Allowed values: \"true\", \"false\""),
        @ApiImplicitParam(name = "isPublic", dataType = "string", paramType = "query", value = "Filters only datasets that are public or not public. Allowed values: \"true\", \"false\""),
        @ApiImplicitParam(name = "withSubject", dataType = "string", paramType = "query", value = "Filters only datasets that have any related concepts. Allowed values: \"true\""),
        @ApiImplicitParam(name = "isNationalComponent", dataType = "string", paramType = "query", value = "Filters only datasets that are national compnents. Allowed values: \"true\""),
        @ApiImplicitParam(name = "subject", dataType = "string", paramType = "query", value = "Filters on concept uri."),
        @ApiImplicitParam(name = "distributionType", dataType = "string", paramType = "query", value = "Filters datasets that have a distribution of chosen type. Allowed values: \"API\",\"Feed\",\"Nedlastbar fil\" \""),
        @ApiImplicitParam(name = "page", dataType = "string", paramType = "query", defaultValue = "0", value = "Page index. First page is 0"),
        @ApiImplicitParam(name = "size", dataType = "string", paramType = "query", defaultValue = "10", value = "Page size")
    })
    public ResponseEntity<String> searchPostHandler(
        @ApiParam(hidden = true)
        @RequestParam Map<String, String> params,

        @ApiParam(hidden = true)
        @RequestBody Map<String, Object> body,

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
        logger.debug("POST /datasets/search{} {}", params, body);

        //merge param sets from body and query section
        Map<String, String> mergedParams = new HashMap<>(params);
        body.forEach((key, value) -> mergedParams.put(key, value.toString()));

        return search(mergedParams, lang, sortfield, sortdirection, returnFields, aggregations, pageable);
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


}
