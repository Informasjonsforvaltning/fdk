package no.fdk.imcat.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.fdk.imcat.model.InformationModel;
import no.fdk.webutils.aggregation.ResponseUtil;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.query.FetchSourceFilter;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SourceFilter;
import org.springframework.hateoas.PagedResources;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/informationmodels")
public class InformationModelSearchController {
    public static final String MISSING = "MISSING";
    private static final Logger logger = LoggerFactory.getLogger(InformationModelSearchController.class);
    private ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    public InformationModelSearchController(ElasticsearchTemplate elasticsearchTemplate
    ) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @ApiOperation(value = "Search in Information Model catalog")
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public PagedResources<InformationModel> search(
        @ApiParam("The query text")
        @RequestParam(value = "q", defaultValue = "", required = false)
            String query,

        @ApiParam("Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238")
        @RequestParam(value = "orgPath", defaultValue = "", required = false)
            String orgPath,

        @ApiParam("Returns Information Models from position x in the result set, 0 is the default value. A value of 150 will return the 150th Information Model in the resultset")
        @RequestParam(value = "from", defaultValue = "0", required = false)
            int from,

        @ApiParam("Specifies the size, i.e. the number of Information Models to return in one request. The default is 10, the maximum number of Information Models returned is 100")
        @RequestParam(value = "size", defaultValue = "10", required = false)
            int size,

        @ApiParam("Calculate aggregations")
        @RequestParam(value = "aggregations", defaultValue = "false", required = false)
            String includeAggregations,

        @ApiParam("Comma separated list of which fields should be returned. E.g id,")
        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

        @ApiParam("Specifies the sort field, at the present we support title, modified and publisher. Default is no value")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "", required = false)
            String sortdirection,

        Pageable pageable
    ) {
        logger.debug("GET /informationmodels?q={}", query);

        QueryBuilder searchQuery;

        if (query.isEmpty()) {
            searchQuery = QueryBuilders.matchAllQuery();
        } else {
            // add * if query only contains one word
            if (!query.contains(" ")) {
                query = query + " " + query + "*";
            }
            searchQuery = QueryBuilders.simpleQueryStringQuery(query);
        }

        BoolQueryBuilder composedQuery = QueryBuilders.boolQuery().must(searchQuery);

        if (!orgPath.isEmpty()) {
            composedQuery.filter(QueryUtil.createTermFilter("publisher.orgPath", orgPath));
        }

        NativeSearchQuery finalQuery = new NativeSearchQueryBuilder()
            .withQuery(composedQuery)
            .withIndices("imcat").withTypes("informationmodel")
            .withPageable(new PageRequest(from, size))
            .build();

        if ("true".equals(includeAggregations)) {
            AbstractAggregationBuilder aggregationBuilder = AggregationBuilders
                .terms("orgPath")
                .field("publisher.orgPath")
                .missing(MISSING)
                .size(Integer.MAX_VALUE)
                .order(Terms.Order.count(false));

            finalQuery.addAggregation(aggregationBuilder);
        }

        if (!StringUtils.isEmpty(returnFields)) {
            SourceFilter sourceFilter = new FetchSourceFilter(returnFields.concat(",prefLabel").split(","), null);
            finalQuery.addSourceFilter(sourceFilter);//TODO: Understand
        }

        if (!StringUtils.isEmpty(sortfield)) {
            addSort(sortfield, sortdirection, finalQuery);
        }

        AggregatedPage<InformationModel> aggregatedPage = elasticsearchTemplate.queryForPage(finalQuery, InformationModel.class);

        List<InformationModel> informationModels = aggregatedPage.getContent();

        PagedResources.PageMetadata pageMetadata = new PagedResources.PageMetadata(
            pageable.getPageSize(),
            pageable.getPageNumber(),
            aggregatedPage.getTotalElements(),
            aggregatedPage.getTotalPages()
        );

        PagedResources<InformationModel> informationModelResources = new PagedResources<>(informationModels, pageMetadata);
        if (aggregatedPage.hasAggregations()) {
            return ResponseUtil.addAggregations(informationModelResources, aggregatedPage);
        } else {
            return informationModelResources;
        }
    }

    private void addSort(String sortfield, String sortdirection, NativeSearchQuery searchBuilder) {
        if (!sortfield.trim().isEmpty()) {

            Sort.Direction sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? Sort.Direction.ASC : Sort.Direction.DESC;
            StringBuilder sbSortField = new StringBuilder();

            if (sortfield.equals("modified")) {
                sbSortField.append("harvest.firstHarvested");
            }

            Sort sort = new Sort(sortOrder, sbSortField.toString());

            logger.debug("sort: {}", sort.toString());
            searchBuilder.addSort(sort);
        }
    }

    static class QueryUtil {
        static QueryBuilder createTermFilter(String term, String value) {
            return value.equals(MISSING) ?
                QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(term)) :
                QueryBuilders.termQuery(term, value);
        }
    }
}
