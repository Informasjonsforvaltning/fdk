package no.ccat.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.ccat.model.ConceptDenormalized;
import org.elasticsearch.action.search.SearchType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            String query
    ) {
        logger.debug("GET /concepts?q={}", query);

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(simpleQueryStringQuery(query))
            .withSearchType(SearchType.DEFAULT)
            .withIndices("ccat").withTypes("concept")
            .build();

        AggregatedPage<ConceptDenormalized> aggregatedPage = elasticsearchTemplate.queryForPage(searchQuery, ConceptDenormalized.class);
        List<ConceptDenormalized> concepts = aggregatedPage.getContent();

        PagedResources<ConceptDenormalized> result = new PagedResources<>(concepts, null);

        return result;
    }
}



