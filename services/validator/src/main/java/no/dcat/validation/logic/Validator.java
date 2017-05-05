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

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by dask on 24.04.2017.
 */
public class Validator {
    private static final Logger logger = LoggerFactory.getLogger(Validator.class);

    private final Map<String, List<PropertyRule>> datasetRuleMap;

    public Validator() {
        List<PropertyRule> datasetRules;
        datasetRuleMap = new HashMap<>();

        Resource p = new ClassPathResource("dataset_rules.json");
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> rules = objectMapper.readValue(p.getInputStream(), Map.class);
            Object o = rules.get("property");
            datasetRules = objectMapper.readValue(objectMapper.writeValueAsString(o),
                    new TypeReference<List<PropertyRule>>() {});

            for (PropertyRule r : datasetRules) {
                String shortName = getPostfixName(r.getPath());

                List<PropertyRule> rulesForProperty = datasetRuleMap.get(shortName);
                if (rulesForProperty == null) {
                    rulesForProperty = new ArrayList<>();
                }
                rulesForProperty.add(r);
                datasetRuleMap.put(shortName, rulesForProperty);
            }

        } catch (IOException e) {
            logger.error("io error", e);
        } catch (Exception e) {
            logger.error("error", e);
        }

    }

    private String getPostfixName(String name) {
        return name.substring(name.indexOf(":") + 1);
    }

    public Validation validate(String[] fields, Map<String, Object> body) {
        Validation validation = new Validation();

         for (String field : fields) {

            List<PropertyRule> propertyRules = datasetRuleMap.get(field);
            if (propertyRules == null || propertyRules.isEmpty()) {
                logger.debug("Property {} has no validation rule: {}", field, Property.WARNING);
                validation.getPropertyReport().add(
                        new Property(field, null, Property.WARNING,
                                String.format("Couldn't find validation rules for property %s", field)));
            } else {
                for (PropertyRule rule : propertyRules) {
                    Object value = body.get(field);

                    handleRule(body, validation, rule, value);
                }
            }
        }

        // Count the errors, warnings, oks
        int oks = 0, errors = 0, warnings = 0;

        for (Property propertyReport : validation.getPropertyReport()) {
            if (propertyReport != null) {
                if (Property.VIOLATION.equals(propertyReport.getSeverity())) {
                    errors++;
                } else if (Property.WARNING.equals(propertyReport.getSeverity())) {
                    warnings++;
                } else {
                    oks++;
                }
            }
        }
        validation.setErrors(errors);
        validation.setWarnings(warnings);
        validation.setOks(oks);

        return validation;
    }

    private void handleRule(Map<String, Object> body, Validation validation, PropertyRule rule, Object value) {
        if (rule.getMinCount() != null) {
            validation.getPropertyReport().add(checkMinCount(rule, value));
        }
        if (rule.getMaxCount() != null) {
            validation.getPropertyReport().add(checkMaxCount(rule, value));
        }
        if (rule.getNodeKind() != null) {
            validation.getPropertyReport().add(checkNodeKind(rule, value));
        }
        if (rule.getConditional() != null) {
            validation.getPropertyReport().add(checkConditional(rule, body, value));
        }
        if (rule.getClazz() != null) {
            validation.getPropertyReport().add(checkClazz(rule, value));
        }
        if (rule.getOr() != null) {
            validation.getPropertyReport().add(checkOr(rule, value));
        }
    }

    public Property checkMinCount(PropertyRule rule, Object value) {
        String ruleName = "minCount";
        if (value instanceof Collection || value instanceof Map || value == null) {
            int size = 0;
            if (value instanceof Collection) {
                size = ((Collection) value).size();
            } else if (value instanceof Map) {
                size = 1;
            }

            if (size < rule.getMinCount()) {
                logger.debug("Property {} breaks rule {}={}. Count was {}: {}",
                        rule.getPath(), ruleName, rule.getMinCount(), size, rule.getSeverity());
                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Missing %s properties", rule.getMinCount()));
            }
        }

        return new Property(rule.getPath(), ruleName);
    }

    public Property checkMaxCount(PropertyRule rule, Object value) {
        String ruleName = "maxCount";
        if (value instanceof Collection) {
            int size = 0;
            if (value instanceof Collection) {
                size = ((Collection) value).size();
            }

            if (size > rule.getMaxCount()) {
                logger.debug("Property {} breaks rule {}={}. Found {}: {}",
                        rule.getPath(), ruleName, rule.getMaxCount(),
                        size, rule.getSeverity());

                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Exceeding more than %s allowed properties", rule.getMaxCount()));
            }
        }

        return new Property(rule.getPath(), ruleName);
    }

    public Property checkNodeKind(PropertyRule rule, Object value) {
        String ruleName = String.format("NodeKind: %s", rule.getNodeKind());


        if ("Literal".equals(rule.getNodeKind())) {
            boolean literalOk = true;

            if (value instanceof Collection) {
                literalOk = isCollectionOfLiterals(value);
            } else {
                literalOk = isLiteral(value);
            }

            if (!literalOk) {
                logger.debug("Property {} breaks rule {} : {}", rule.getPath(), ruleName, rule.getSeverity());
                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Property is not a %s", rule.getNodeKind()));
            }
        }

        return new Property(rule.getPath(), ruleName);
    }

    public Property checkClazz(PropertyRule rule, Object value) {
        String ruleName = String.format("Class is %s", rule.getClazz());
        String propertyName = rule.getPath();
        String foundClass = null;

        if (value instanceof Collection) {
            Collection list = (Collection) value;
            for (Object object : list) {
                foundClass = getClassName(object);
                if (foundClass != null) {
                    break;
                }
            }
        } else {
            foundClass = getClassName(value);
        }

        if (foundClass == null) {
            logger.debug("Property {} breaks rule {}. Found {} : {}",
                    propertyName,
                    ruleName, foundClass, rule.getSeverity());

            return new Property(rule.getPath(),
                    ruleName,
                    rule.getSeverity(),
                    String.format("Property %s is not refering to class %s",
                            propertyName, rule.getClazz()));
        } else {
            return new Property(rule.getPath(), ruleName);
        }

    }

    private String getClassName(Object value) {
        if (value != null) {
            if (value instanceof Map) {
                Map<?,?> map = (Map<?,?>) value;
                if (map.get("uri") != null) {
                    return "URI";
                }
            }
            return value.getClass().getSimpleName();
        }
        return null;
    }

    public Property checkConditional(PropertyRule rule, Map<String, Object> data, Object value) {
        String ruleName = String.format("Conditional: %s", rule.getConditional());
        String propertyName = getPostfixName(rule.getConditional().getProperty());

        Object required = data.get(propertyName);
        if (required instanceof Map) {
            Object requiredValue = ((Map) required).get("code");
            if (requiredValue instanceof String) {
                String requiredString = (String) requiredValue;
                boolean ok = false;
                for (String mustHaveValue : rule.getConditional().getValues()) {
                    if (mustHaveValue.equalsIgnoreCase(requiredString)) {
                        ok = true;
                        break;
                    }
                }
                if (ok && (value == null || !isCollectionOfLiterals(value))) {
                    logger.debug("Property {} breaks rule {} : {}", rule.getPath(),
                            ruleName, rule.getSeverity());
                    return new Property(rule.getPath(),
                            ruleName,
                            rule.getSeverity(),
                            String.format("Property %s should be present when %s is %s",
                                    propertyName,
                                    rule.getConditional().getProperty(),
                                    rule.getConditional().getValues()));
                }
            }
        }


        return new Property(rule.getPath(), ruleName);

    }

    public Property checkOr(PropertyRule rule, Object value) {
        final String ruleName = String.format("Or: %s", rule.getOr());
        String msg = "";
        if (value != null) {
            boolean ok = false;
            for (Object r : rule.getOr()) {
                if (r instanceof Map) {
                    Map<String, String> orRule = (Map<String, String>) r;
                    msg = checkSimpleDatatype(orRule.get("datatype"), value);
                    if (msg == null) {
                        ok = true;
                        break;
                    } else {
                        msg = String.format("%s is not a %s", value, orRule.get("datatype"));
                    }
                }
            }
            if (ok) {
                return new Property(rule.getPath(), ruleName);
            } else {
                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Property is invalid: %s", msg));
            }
        }
        return null;
    }

    public String checkSimpleDatatype(String datatype, Object value){

        if (value instanceof String) {
            String result = null;

            if ("xsd:date".equals(datatype)) {
                try {
                    DatatypeConverter.parseDate((String) value);

                } catch (IllegalArgumentException iae) {
                    logger.trace("Illegal date {}", value, iae);
                    result = iae.getMessage();
                }
            } else if ("xsd:dateTime".equals(datatype)) {
                try {
                    DatatypeConverter.parseDateTime((String) value);

                } catch (IllegalArgumentException iae) {
                    logger.trace("Illegal dateTime {}", value, iae);
                    result = iae.getMessage();
                }
            }
            return result;
        }

        return "Value is not simple datatype";
    }

    private boolean isCollectionOfLiterals(Object value) {
        if (value instanceof Collection) {
            boolean literal = true;
            Collection<Object> list = (Collection) value;
            for (Object item : list) {
                if (!isLiteral(item)) {
                    literal = false;
                }
            }

            return literal;
        }
        return false;
    }



        private boolean isLiteral(Object value) {
        if (value instanceof Map || value instanceof String || value instanceof Number) {
            return true;
        }

        return false;
    }
}
