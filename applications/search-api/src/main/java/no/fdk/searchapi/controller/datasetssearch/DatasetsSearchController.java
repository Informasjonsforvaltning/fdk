package no.fdk.searchapi.controller.datasetssearch;

import no.dcat.client.referencedata.ReferenceDataClient;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsSearchController {
    private static Logger logger = LoggerFactory.getLogger(DatasetsSearchController.class);
    ReferenceDataClient referenceDataClient;
    private ElasticsearchService elasticsearch;

    @Value("${application.referenceDataUrl}")
    private String referenceDataUrl;

    @Autowired
    public DatasetsSearchController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    private static boolean hasLOSFilter(Map<String, String> params) {
        return params.containsKey("losTheme");
    }

    @PostConstruct
    public void initialize() {
        this.referenceDataClient = new ReferenceDataClient(referenceDataUrl);
    }

    /**
     * Compose and execute an elasticsearch query on dcat based on the input parameters.
     * <p>
     *
     * @return List of  elasticsearch records.
     */
    @CrossOrigin
    @RequestMapping(value = "/datasets", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<String> search(
        @RequestParam Map<String, String> params,

        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @RequestParam(value = "sortdirection", defaultValue = "desc", required = false)
            String sortdirection,

        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

        @RequestParam(value = "aggregations", defaultValue = "", required = false)
            String aggregations,

        @PageableDefault()
            Pageable pageable
    ) {
        logger.debug("GET /datasets?{}", params);

        int from = checkAndAdjustFrom((int) pageable.getOffset());
        int size = checkAndAdjustSize(pageable.getPageSize());

        if (hasLOSFilter(params)) {
            //Since the builder is static, it can not request expanded LOS expressions
            //from reference-data, so we do it here instead.
            String losFilters = params.get("losTheme");
            if (losFilters != null && !losFilters.isEmpty()) {
                List<String> mainTermsWithTheirExpansions = new ArrayList<>();
                String[] themes = losFilters.split(",");

                for (String theme : themes) {
                    List<String> expanded = referenceDataClient.expandLOSTemaByLOSPath(theme);
                    mainTermsWithTheirExpansions.add(expanded.stream().collect(Collectors.joining(",")));
                }
                params.put("losTheme", mainTermsWithTheirExpansions.stream().collect(Collectors.joining("|")));
            }
        }

        QueryBuilder searchQuery = new DatasetsSearchQueryBuilder()
            .lang(lang)
            .boostNationalComponents()
            .boostTitle(params.get("q"))  //If the term the user searches for is a direct hit for the title of the dataset, that result should come first
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
    @RequestMapping(value = "/datasets/search", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<String> searchPostHandler(
        @RequestParam Map<String, String> params,

        @RequestBody Map<String, Object> body,

        @RequestParam(value = "lang", defaultValue = "nb", required = false)
            String lang,

        @RequestParam(value = "sortfield", defaultValue = "", required = false)
            String sortfield,

        @RequestParam(value = "sortdirection", defaultValue = "desc", required = false)
            String sortdirection,

        @RequestParam(value = "returnfields", defaultValue = "", required = false)
            String returnFields,

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
