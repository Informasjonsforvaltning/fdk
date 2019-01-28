package no.fdk.imcat.controller;

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

    private InformationmodelRepository informationmodelRepository;

    @Autowired
    public InformationModelGetController(InformationmodelRepository informationmodelRepository) {
        this.informationmodelRepository = informationmodelRepository;
    }

    @ApiOperation(value = "Get a specific Informationmodel", response = InformationModel.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public InformationModel getInformationModel(@PathVariable String id) throws NotFoundException {
        Optional<InformationModel> informationModelOptional = informationmodelRepository.findById(id);

        if (!informationModelOptional.isPresent()) {
            throw new NotFoundException();
        }

        return informationModelOptional.get();
    }


}
