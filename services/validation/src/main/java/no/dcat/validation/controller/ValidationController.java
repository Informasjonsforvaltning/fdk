package no.dcat.validation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.validation.logic.Validator;
import no.dcat.validation.model.Property;
import no.dcat.validation.model.Validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

/**
 * Created by dask on 24.04.2017.
 */
@RestController
public class ValidationController {
    private static Logger logger = LoggerFactory.getLogger(ValidationController.class);

    Validator validator = new Validator();

    @CrossOrigin
    @RequestMapping(value = "/dataset/{fields}",
            method = RequestMethod.GET,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Validation> validateDataset(
            @RequestBody HttpEntity<Map<String,Object>> raw,
            @PathVariable(name="fields", required = false) String fields) throws Exception {

        //ObjectMapper mapper = new ObjectMapper();

        Map<String,Object> body = raw.getBody();

        logger.info("Validation request: check {} of {}", fields, body);

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
