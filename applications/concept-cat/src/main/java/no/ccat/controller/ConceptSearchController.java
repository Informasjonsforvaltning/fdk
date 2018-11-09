package no.ccat.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.ccat.hateoas.PagedResourceWithAggregations;
import no.ccat.model.ConceptDenormalized;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.elasticsearch.index.query.QueryBuilders.simpleQueryStringQuery;

@CrossOrigin
@RestController
@RequestMapping(value = "/concepts")
public class ConceptSearchController {
    private static final Logger logger = LoggerFactory.getLogger(ConceptSearchController.class);

    private ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    public ConceptSearchController(ElasticsearchTemplate elasticsearchTemplate
    ) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @ApiOperation(value = "Search in concept catalog")
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public PagedResources<ConceptDenormalized> search(
        @ApiParam("The query text")
        @RequestParam(value = "q", defaultValue = "", required = false)
            String query,
        @ApiParam("Calculate aggregations")
        @RequestParam(value = "aggregations", defaultValue = "false", required = false)
            String includeAggregations,
        Pageable pageable
    ) {
        logger.debug("GET /concepts?q={}", query);

        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(simpleQueryStringQuery(query))
            .withSearchType(SearchType.DEFAULT)
            .withIndices("ccat").withTypes("concept")
            .withPageable(pageable)
            .build();

        if ("true".equals(includeAggregations)) {
            AbstractAggregationBuilder aggregationBuilder = AggregationBuilders
                .terms("orgPath")
                .field("publisher.orgPath")
                .missing(MISSING)
                .size(MAX_AGGREGATIONS)
                .order(Terms.Order.count(false));

            searchQuery.addAggregation(aggregationBuilder);
        }

        AggregatedPage<ConceptDenormalized> aggregatedPage = elasticsearchTemplate.queryForPage(searchQuery, ConceptDenormalized.class);
        List<ConceptDenormalized> concepts = aggregatedPage.getContent();

        PagedResources.PageMetadata pageMetadata = new PagedResources.PageMetadata(
            pageable.getPageSize(),
            pageable.getPageNumber(),
            aggregatedPage.getTotalElements(),
            aggregatedPage.getTotalPages()
        );

        PagedResources<ConceptDenormalized> conceptResources = new PagedResources<>(concepts, pageMetadata);

        if (aggregatedPage.hasAggregations()) {
            return ResponseUtil.addAggregations(conceptResources, aggregatedPage);
        } else {
            return conceptResources;
        }
    }

    static class ResponseUtil {
        static PagedResourceWithAggregations<ConceptDenormalized> addAggregations(PagedResources<ConceptDenormalized> conceptResources, AggregatedPage<ConceptDenormalized> aggregatedPage) {
            return new PagedResourceWithAggregations<>(conceptResources, extractAggregations(aggregatedPage));
        }

        static Map<String, no.ccat.model.Aggregation> extractAggregations(AggregatedPage<ConceptDenormalized> aggregatedPage) {
            Map<String, Aggregation> aggregationsElastic = aggregatedPage.getAggregations().getAsMap();
            //todo this aggregating seems now to be an emergent pattern, shared with api, refacor out as common (together with the harvest history)
            final Map<String, no.ccat.model.Aggregation> aggregations = new HashMap<>();
            aggregationsElastic.forEach((aggregationName, aggregation) -> {
                no.ccat.model.Aggregation outputAggregation = new no.ccat.model.Aggregation() {{
                    buckets = new ArrayList<>();
                }};

                ((Terms) aggregation).getBuckets().forEach((bucket) -> {
                    outputAggregation.getBuckets().add(no.ccat.model.AggregationBucket.of(bucket.getKeyAsString(), bucket.getDocCount()));
                });
                aggregations.put(aggregationName, outputAggregation);
            });
            return aggregations;
        }
    }
}



