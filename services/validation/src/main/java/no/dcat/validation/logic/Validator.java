package no.dcat.validation.logic;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.validation.model.Property;
import no.dcat.validation.model.PropertyRule;
import no.dcat.validation.model.Validation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.web.JsonPath;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * Created by dask on 24.04.2017.
 */
public class Validator {
    private static final Logger logger = LoggerFactory.getLogger(Validator.class);
    List<PropertyRule> datasetRules;

    public Validator() {
        Resource p = new ClassPathResource("dataset_rules.json");
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> rules = objectMapper.readValue(p.getInputStream(), Map.class);
            Object o = rules.get("property");
            datasetRules = objectMapper.readValue(objectMapper.writeValueAsString(o), new TypeReference<List<PropertyRule>>(){} );
            System.out.println(datasetRules.size());

        } catch (IOException e) {
            logger.error("io error", e);
        } catch (Exception e) {
            logger.error("error", e);
        }

    }

    public Validation validate(String[] field, Map<String, Object> body) {
        Validation validation = new Validation();
        for (String f : field) {
            logger.debug("check {}", f);

            Property p = new Property(f);
            Object obj = body.get(f);
            if (obj != null) {
                if (f.equals("title")) {
                    p.setMessage("OK");
                }
            }
            validation.getPropertyReport().add(p);
        }
        return validation;
    }
}
