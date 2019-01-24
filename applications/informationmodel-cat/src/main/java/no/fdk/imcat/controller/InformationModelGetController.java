package no.fdk.imcat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiOperation;
import no.dcat.webutils.exceptions.NotFoundException;
import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.service.InformationmodelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/informationmodels")
public class InformationModelGetController {
    private static final Logger logger = LoggerFactory.getLogger(InformationModelGetController.class);

    private static final String marker = "dummyMarkerValueDontDelete";

    private InformationmodelRepository informationmodelRepository;

    @Autowired
    public InformationModelGetController(InformationmodelRepository informationmodelRepository) {
        this.informationmodelRepository = informationmodelRepository;
    }

    @ApiOperation(value = "Get a specific Informationmodel", response = InformationModel.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public String getInformationModel(@PathVariable String id) throws NotFoundException {
        Optional<InformationModel> informationModelOptional = informationmodelRepository.findById(id);

        if (!informationModelOptional.isPresent()) {
            throw new NotFoundException();
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            InformationModel model = informationModelOptional.get();
            String theRawJSONSchema = model.getSchema();

            //Let us all agree that this is a hack. In an ideal world we would just return the InformationModel and Spring boot
            //would auto convert it to JSON. If we DO try this, the schemas are all escaped, which we do not want. Both writing
            //custom Serializer and other ways to force Jackson(the JSON library used) failed to prevent this double escaping.
            model.setSchema(marker);  //set in an unique marker in the document

            String theEntireDocument = mapper.writeValueAsString(model);//do the normal to JSON Conversion

            //We now use the marker to locate where we manually should insert the raw JSON
            int startIndex = theEntireDocument.indexOf(marker) - 1; //-1 to not include the start " of the marker
            int endIndex = startIndex + marker.length() + 2; //+2 to counteract the above -1 and another to not include the end " of the marker

            String theEntireCompositeDocument = theEntireDocument.substring(0, startIndex) + theRawJSONSchema + theEntireDocument.substring(endIndex);

            return theEntireCompositeDocument;

        } catch (JsonProcessingException jpe) {
            logger.debug("Failed while serializing information model to JSON", jpe);
            logger.trace(jpe.getStackTrace().toString());
        }
        return "";
    }
}
