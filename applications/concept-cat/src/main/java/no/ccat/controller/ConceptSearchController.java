package no.ccat.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.ccat.model.ConceptDenormalized;
import no.fdk.webutils.aggregation.ResponseUtil;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.query.FetchSourceFilter;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SourceFilter;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static no.ccat.controller.Common.MISSING;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@CrossOrigin
@RestController
@RequestMapping(value = "/concepts")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConceptSearchController {

    private static final Logger logger = LoggerFactory.getLogger(ConceptSearchController.class);
    private ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    public ConceptSearchController(ElasticsearchTemplate elasticsearchTemplate
    ) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @ApiOperation(value = "Search in concept catalog")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "q", dataType = "string", paramType = "query", value = "Full content search"),
        @ApiImplicitParam(name = "orgPath", dataType = "string", paramType = "query", value = "Filters on publisher's organization path (orgPath), e.g. /STAT/972417858/971040238"),
        @ApiImplicitParam(name = "prefLabel", dataType = "string", paramType = "query", value = "The prefLabel text"),


        @ApiImplicitParam(name = "page", dataType = "string", paramType = "query", defaultValue = "0", value = "Page index. First page is 0"),
        @ApiImplicitParam(name = "size", dataType = "string", paramType = "query", defaultValue = "10", value = "Page size")
    })
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public PagedResources<ConceptDenormalized> search(
        @ApiParam(hidden = true)
        @RequestParam Map<String, String> params,

        @ApiParam("Comma separated list of which fields should be returned. E.g id,")
        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

        @ApiParam("Calculate aggregations")
        @RequestParam(value = "aggregations", defaultValue = "false", required = false)
            String aggregations,

        @ApiParam("Specifies the sort field, at the present the only value is \"modified\". Default is no value, and results are sorted by relevance")
        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @ApiParam("Specifies the sort direction of the sorted result. The directions are: asc for ascending and desc for descending")
        @RequestParam(value = "sortdirection", defaultValue = "", required = false)
            String sortdirection,

        @PageableDefault()
            Pageable pageable
    ) {
        logger.debug("GET /concepts?q={}", params);

        QueryBuilder searchQuery = new ConceptSearchESQueryBuilder()
            .addParams(params)
            .boostPrefLabel(params.get("q")) //If the term the user searches for is a direct hit for the preflabel/actual term of the concept, that result should come first
            .build();

        NativeSearchQuery finalQuery = new NativeSearchQueryBuilder()
            .withQuery(searchQuery)
            .withIndices("ccat").withTypes("concept")
            .withPageable(pageable)
            .build();

        if (isNotEmpty(aggregations)) {
            finalQuery = addAggregations(finalQuery, aggregations);
        }

        if (isNotEmpty(returnFields)) {
            SourceFilter sourceFilter = new FetchSourceFilter(returnFields.concat(",prefLabel").split(","), null);
            finalQuery.addSourceFilter(sourceFilter);
        }

        if ("modified".equals(sortfield)) {
            Sort.Direction sortOrder = sortdirection.toLowerCase().contains("asc".toLowerCase()) ? Sort.Direction.ASC : Sort.Direction.DESC;
            String sortProperty = "harvest.firstHarvested";
            finalQuery.addSort(new Sort(sortOrder, sortProperty));
        }

        AggregatedPage<ConceptDenormalized> aggregatedPage = elasticsearchTemplate.queryForPage(finalQuery, ConceptDenormalized.class);
        List<ConceptDenormalized> concepts = aggregatedPage.getContent();

        stripEmptyObjects(concepts);

        PagedResources.PageMetadata pageMetadata = new PagedResources.PageMetadata(
            pageable.getPageSize(),
            pageable.getPageNumber(),
            aggregatedPage.getTotalElements(),
            aggregatedPage.getTotalPages()
        );

        logger.info("usagecount concept "+concepts.size());

        PagedResources<ConceptDenormalized> conceptResources = new PagedResources<>(concepts, pageMetadata);

        if (aggregatedPage.hasAggregations()) {
            return ResponseUtil.addAggregations(conceptResources, aggregatedPage);
        } else {
            return conceptResources;
        }
    }

    public NativeSearchQuery addAggregations(NativeSearchQuery searchQuery, String aggregationFields) {
        HashSet<String> selectedAggregationFields = new HashSet<>(Arrays.asList(aggregationFields.split(",")));

        if (selectedAggregationFields.contains("orgPath")) {
            searchQuery.addAggregation(AggregationBuilders
                .terms("orgPath")
                .field("publisher.orgPath")
                .missing(MISSING)
                .size(Integer.MAX_VALUE)
                .order(Terms.Order.count(false)));
        }
        if (selectedAggregationFields.contains("firstHarvested")) {
            searchQuery.addAggregation(ESQueryUtil.createTemporalAggregation("firstHarvested", "harvest.firstHarvested"));
        }

        if (selectedAggregationFields.contains("publisher")) {
            searchQuery.addAggregation(ESQueryUtil.createTermsAggregation("publisher", "publisher.id.keyword"));
        }
        return searchQuery;
    }

    private void stripEmptyObjects(List<ConceptDenormalized> concepts) {
        //In order for spring to not include Source or Remark when its parts are empty we need to null out the source object itself.
        for (ConceptDenormalized concept : concepts) {
            ConceptGetController.stripEmptyObject(concept);
        }
    }
}
