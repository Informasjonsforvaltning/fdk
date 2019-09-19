package no.fdk.searchapi.controller;

import com.google.gson.Gson;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.shared.Dataset;
import no.fdk.searchapi.service.ElasticsearchService;
import no.fdk.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;


/**
 * A simple search service. Receives a query and forwards the query to Elasticsearch, return results.
 * <p>
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DatasetsQueryController {
    public static final String INDEX_DCAT = "dcat";
    /* api names */
    public static final String QUERY_GET_BY_ID = "/datasets/{id}";
    public static final String QUERY_GET_BY_URI = "/datasets/byuri";
    private static Logger logger = LoggerFactory.getLogger(DatasetsQueryController.class);
    private ElasticsearchService elasticsearch;

    @Autowired
    public DatasetsQueryController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    /**
     * Retrieves the dataset record identified by the provided id.
     *
     * @return the record (JSON) of the retrieved dataset.
     */
    @RequestMapping(
        value = QUERY_GET_BY_ID,
        method = RequestMethod.GET,
        produces = {"application/json", "text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getDatasetByIdHandler(
        HttpServletRequest request,
        @PathVariable String id) throws NotFoundException {
        logger.info(String.format("Get dataset with id: %s", id));

        Dataset dataset = getDatasetById(id);
        if (dataset == null) {
            throw new NotFoundException();
        }

        String acceptHeader = request.getHeader("Accept");
        String contentType = acceptHeader != null ? acceptHeader : "";

        return transformResponse(dataset, contentType);
    }

    @RequestMapping(
        value = QUERY_GET_BY_URI,
        method = RequestMethod.GET,
        produces = {"application/json", "text/turtle", "application/ld+json", "application/rdf+xml"})
    public ResponseEntity<String> getDatasetByUriHandler(
        HttpServletRequest request,
        @RequestParam("uri") String uri) throws Exception {
        logger.info(String.format("Get dataset with uri: %s", uri));

        Dataset dataset = getDatasetByUri(uri);
        if (dataset == null) {
            throw new NotFoundException();
        }

        String acceptHeader = request.getHeader("Accept");
        String contentType = acceptHeader != null ? acceptHeader : "";

        return transformResponse(dataset, contentType);
    }

    Dataset getDatasetById(String id) {
        GetResponse elasticGetResponse = elasticsearch.getClient().prepareGet(INDEX_DCAT, "dataset", id).get();

        if (!elasticGetResponse.isExists()) {
            return null;
        }
        String datasetAsJson = elasticGetResponse.getSourceAsString();
        logger.trace(String.format("Found dataset: %s", datasetAsJson));

        return new Gson().fromJson(datasetAsJson, Dataset.class);
    }

    Dataset getDatasetByUri(String uri) throws Exception {

        SearchRequestBuilder searchBuilder = elasticsearch.getClient().prepareSearch("dcat")
            .setTypes("dataset")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(QueryBuilders.termQuery("uri", uri));

        logger.debug("Search dataset by uri query: {}", searchBuilder.toString());

        SearchResponse response = searchBuilder.execute().actionGet();

        SearchHit[] hits = response.getHits().getHits();

        if (hits.length == 0) {
            return null;
        }

        if (hits.length == 1) {
            return new Gson().fromJson(hits[0].getSourceAsString(), Dataset.class);
        }

        throw new Exception("More than one dataset match found, count=" + hits.length + " uri=" + uri);
    }

    ResponseEntity<String> transformResponse(Dataset d, String contentType) {
        if (contentType.contains("text/turtle")) {
            return ResponseEntity.ok()
                .contentType(new MediaType("text", "turtle"))
                .body(DcatBuilder.transform(d, "TURTLE"));
        } else if (contentType.contains("application/ld+json")) {
            return ResponseEntity.ok()
                .contentType(new MediaType("application", "ld+json"))
                .body(DcatBuilder.transform(d, "JSON-LD"));
        } else if (contentType.contains("application/rdf+xml")) {
            return ResponseEntity.ok()
                .contentType(new MediaType("application", "rdf+xml"))
                .body(DcatBuilder.transform(d, "RDF/XML"));
        } else {
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new Gson().toJson(d));
        }
    }

}
