package no.acat.restapi;

import io.swagger.annotations.ApiOperation;
import no.acat.model.ApiDocument;
import no.acat.repository.ApiDocumentRepository;
import no.dcat.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis")
public class ApiRestController {
    private static final Logger logger = LoggerFactory.getLogger(ApiRestController.class);

    private ApiDocumentRepository apiDocumentRepository;

    @Autowired
    public ApiRestController(ApiDocumentRepository apiDocumentRepository) {
        this.apiDocumentRepository = apiDocumentRepository;
    }

    @ApiOperation(value = "Get a specific api", response = ApiDocument.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ApiDocument getApiDocument(@PathVariable String id) throws NotFoundException, IOException {
        logger.info("request for {}", id);

        Optional<ApiDocument> apiDocumentOptional = apiDocumentRepository.getById(id);

        return apiDocumentOptional.orElseThrow(() -> new NotFoundException());
    }
}
