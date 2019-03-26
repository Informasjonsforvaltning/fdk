package no.acat.controller.dsop;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import no.acat.controller.ApiSearchESQueryBuilder;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
/*

DSOP section of api catalog is the implementation of requirements for DSOP projects

https://www.bits.no/project/dsop/

 */

@CrossOrigin
@RestController
@RequestMapping(value = "/apis/endpoints")
public class DsopEndpointSearchController {
    public static final int MAX_ES_SIZE = 10000;
    private static final Logger logger = LoggerFactory.getLogger(DsopEndpointSearchController.class);
    private ElasticsearchService elasticsearch;

    @Autowired
    public DsopEndpointSearchController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    @ApiOperation(value = "Queries the api catalog for api specifications",
        notes = "dedicated path to serve endpoints based on organization and/or standard", response = EndpointQueryResponse.class)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "active", dataType = "string", paramType = "query", value = "Filters active (not expired and not removed)"),
        @ApiImplicitParam(name = "serviceType", dataType = "string", paramType = "query", value = "Filters by service type"),
        @ApiImplicitParam(name = "orgNos", dataType = "string", paramType = "query", value = "Filters by publisher organisation number. Multiple values separated with commas.")
    })
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public EndpointQueryResponse search(
        @ApiParam(hidden = true)
        @RequestParam Map<String, String> params
    ) {
        logger.debug("GET /apis/endpoints?{}", params);

        QueryBuilder searchQuery = new ApiSearchESQueryBuilder()
            .boostNationalComponents()
            .addParams(params) //NB! all supported search params are extracted, not only documented
            .build();

        SearchRequestBuilder searchRequest = elasticsearch.getClient()
            .prepareSearch("acat")
            .setTypes("apidocument")
            .setQuery(searchQuery)
            .setSize(MAX_ES_SIZE)
            .setFetchSource(Endpoint.SOURCE_FIELDS, null);

        logger.debug("Executing query: {}", searchRequest.toString());

        SearchResponse elasticResponse = searchRequest.execute().actionGet();

        return EndpointQueryResponse.fromElasticResponse(elasticResponse);
    }
}
