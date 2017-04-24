package no.dcat.validation.controller;

import no.dcat.validation.logic.Validator;
import no.dcat.validation.model.Property;
import no.dcat.validation.model.Validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@RequestMapping(value = "")
public class ValidationController {
    private static Logger logger = LoggerFactory.getLogger(ValidationController.class);

    @RequestMapping(value = "dataset/{fields}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Validation> validateDataset(@RequestBody Map<String,Object> body, @PathVariable String fields) {
        logger.info("Validation request: check {} of {}", fields, body);

        String[] field = fields.split(",");

        Validator v = new Validator();


        return new ResponseEntity<Validation>(v.validate(field, body), HttpStatus.OK);
    }
}
