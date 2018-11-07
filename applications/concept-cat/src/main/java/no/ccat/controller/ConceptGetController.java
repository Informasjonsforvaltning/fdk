package no.ccat.controller;

import io.swagger.annotations.ApiOperation;
import no.ccat.model.ConceptDenormalized;
import no.ccat.service.ConceptDenormalizedRepository;
import no.dcat.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/concepts")
public class ConceptGetController {
    private static final Logger logger = LoggerFactory.getLogger(ConceptGetController.class);

    private ConceptDenormalizedRepository conceptDenormalizedRepository;

    @Autowired
    public ConceptGetController(ConceptDenormalizedRepository conceptDenormalizedRepository) {
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
    }

    @ApiOperation(value = "Get a specific concept", response = ConceptDenormalized.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ConceptDenormalized getConceptDenormalized(@PathVariable String id) throws NotFoundException {
        logger.debug("GET /concepts/{}", id);
        Optional<ConceptDenormalized> conceptDenormalizedOptional = conceptDenormalizedRepository.findById(id);


        if (!conceptDenormalizedOptional.isPresent()) {
            throw new NotFoundException();
        }
        return conceptDenormalizedOptional.get();
    }
}
