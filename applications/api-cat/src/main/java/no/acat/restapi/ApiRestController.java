package no.acat.restapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.dcat.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.get.GetResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ApiRestController {
    private static final Logger logger = LoggerFactory.getLogger(ApiRestController.class);

    private ElasticsearchService elasticsearch;
    private ObjectMapper mapper;

    @Autowired
    public ApiRestController(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearch = elasticsearchService;
        this.mapper = mapper;
    }

    @ApiOperation(value = "Get a specific api", response = ApiDocument.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ApiDocument getApiDocument(@PathVariable String id) throws NotFoundException, IOException {
        logger.info("request for {}", id);

        GetResponse getResponse = elasticsearch.getClient().prepareGet("acat", "apidocument", id).get();

        if (!getResponse.isExists()) {
            throw new NotFoundException();
        }
        ApiDocument apiDocument = mapper.readValue(getResponse.getSourceAsString(), ApiDocument.class);
        return apiDocument;
    }
}
