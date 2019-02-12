package no.ccat.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiOperation;
import no.ccat.common.model.Source;
import no.ccat.model.ConceptDenormalized;
import no.ccat.service.ConceptDenormalizedRepository;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/concepts")
@JsonInclude(JsonInclude.Include.NON_NULL)
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
        ConceptDenormalized concept = conceptDenormalizedOptional.get();
        stripEmptyObject(concept);
        return concept;
    }

    //In order for spring to not include Source or Remark when its parts are empty we need to null out the source object itself.
    public static void stripEmptyObject(ConceptDenormalized concept) {
        if (concept.getDefinition() != null) {
            if (concept.getDefinition().getSource() != null) {
                Source source = concept.getDefinition().getSource();
                if (source.getUri() == null && (source.getPrefLabel() == null || source.getPrefLabel().size() == 0)) {
                    concept.getDefinition().setSource(null);
                }
            }
            if (concept.getDefinition().getRemark() != null && concept.getDefinition().getRemark().size() == 0) {
                concept.getDefinition().setRemark(null);
            }
        }
    }

}
