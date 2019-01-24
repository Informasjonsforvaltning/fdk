package no.fdk.imcat.controller;

import io.swagger.annotations.ApiOperation;
import no.dcat.webutils.exceptions.NotFoundException;
import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelForOutput;
import no.fdk.imcat.service.InformationModelForOutputFactory;
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

    private InformationmodelRepository informationmodelRepository;

    @Autowired
    public InformationModelGetController(InformationmodelRepository informationmodelRepository) {
        this.informationmodelRepository = informationmodelRepository;
    }

    @ApiOperation(value = "Get a specific Informationmodel", response = InformationModel.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public InformationModelForOutput getInformationModel(@PathVariable String id) throws NotFoundException {
        Optional<InformationModel> informationModelOptional = informationmodelRepository.findById(id);

        if (!informationModelOptional.isPresent()) {
            throw new NotFoundException();
        }
        //In order to not experience double escaping of the schemas, we need to annotate a field with @JsonRawValue, but this only works on output.
        //So we must have a separate class with the @JsonRawValue field.
        InformationModelForOutput modelForOutput = InformationModelForOutputFactory.getInformationModelForOutput(informationModelOptional.get());

        return modelForOutput;
    }


}
