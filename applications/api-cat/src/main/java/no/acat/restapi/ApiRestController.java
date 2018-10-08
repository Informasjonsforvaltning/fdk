package no.acat.restapi;

import com.google.gson.Gson;
import io.swagger.annotations.ApiOperation;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.dcat.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.get.GetResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ApiRestController {
    private static final Logger logger = LoggerFactory.getLogger(ApiRestController.class);

    private ElasticsearchService elasticsearch;

    @Autowired
    public ApiRestController(ElasticsearchService elasticsearchService) {
        this.elasticsearch = elasticsearchService;
    }

    @ApiOperation(value = "Get a specific api", response = ApiDocument.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ApiDocument getApiDocument(@PathVariable String id) throws NotFoundException {
        logger.info("request for {}", id);

        GetResponse getResponse = elasticsearch.getClient().prepareGet("acat", "apispec", id).get();

        if (!getResponse.isExists()) {
            throw new NotFoundException();
        }

        return new Gson().fromJson(getResponse.getSourceAsString(), ApiDocument.class);
    }
}
