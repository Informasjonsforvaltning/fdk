package no.dcat.validation.controller;

import no.dcat.validation.logic.Validator;
import no.dcat.validation.model.Validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by dask on 24.04.2017.
 */
@RestController
public class ValidatorController {
    private static Logger logger = LoggerFactory.getLogger(ValidatorController.class);

    Validator validator = new Validator();

    @CrossOrigin
    @RequestMapping(value = "/dataset",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Validation> validateCompleteDataset(
            @RequestBody Map<String,Object> body) {

        return doValidation(body, null);
    }

    @CrossOrigin
    @RequestMapping(value = "/dataset/{fields}",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Validation> validateDataset(
            @RequestBody Map<String,Object> body,
            @PathVariable(name="fields", value="") String fields) {

        return doValidation(body, fields);
    }

    private ResponseEntity<Validation> doValidation(Map<String, Object> body,
                                                    String fields) {

        logger.info("Validation request: check {} of {}", fields, body);

        if (body == null) {
            return new ResponseEntity<Validation>(HttpStatus.BAD_REQUEST);
        }

        String[] field = null;

        if (fields != null && !"".equals(fields)) {
            // validate only properties from fields
            field = fields.split(",");

        } else {
            // attempt to validate all properties submitted in body
            field = body.keySet().toArray(new String[body.size()]);
        }

        Validation validationResult = validator.validate(field, body);

        if (validationResult != null) {
            return new ResponseEntity<Validation>(validationResult, HttpStatus.OK);
        }

        return new ResponseEntity<Validation>(HttpStatus.BAD_REQUEST);
    }
}
