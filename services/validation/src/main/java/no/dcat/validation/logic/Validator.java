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
    private List<PropertyRule> datasetRules;
    private Map<String, List<PropertyRule>> datasetRuleMap;

    public Validator() {
        datasetRuleMap = new HashMap<>();
        Resource p = new ClassPathResource("dataset_rules.json");
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> rules = objectMapper.readValue(p.getInputStream(), Map.class);
            Object o = rules.get("property");
            datasetRules = objectMapper.readValue(objectMapper.writeValueAsString(o), new TypeReference<List<PropertyRule>>() {
            });

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

    public Validation validate(String[] field, Map<String, Object> body) {
        Validation validation = new Validation();

         for (String f : field) {

            List<PropertyRule> propertyRules = datasetRuleMap.get(f);
            if (propertyRules != null && propertyRules.size() > 0) {
                for (PropertyRule rule : propertyRules) {
                    Object value = body.get(f);

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

                }
            } else {
                logger.debug("Property {} has no validation rule: {}", f, Property.WARNING);
                validation.getPropertyReport().add(new Property(f, null, Property.WARNING, String.format("Couldn't find validation rules for property %s", f)));
            }
        }

        // Count the errors, warnings, oks
        int oks = 0, errors = 0, warnings = 0;

        for (Property propertyReport : validation.getPropertyReport()) {
            if (Property.VIOLATION.equals(propertyReport.getSeverity())) {
                errors++;
            } else if (Property.WARNING.equals(propertyReport.getSeverity())) {
                warnings++;
            } else {
                oks++;
            }
        }
        validation.setErrors(errors);
        validation.setWarnings(warnings);
        validation.setOks(oks);

        return validation;
    }

    public Property checkMinCount(PropertyRule rule, Object value) {
        final String ruleName = "minCount";
        if (value instanceof Collection || value instanceof Map || value == null) {
            int size = 0;
            if (value instanceof Collection) {
                size = ((Collection) value).size();
            } else if (value instanceof Map) {
                size = 1;
            }

            if (size < rule.getMinCount()) {
                logger.debug("Property {} breaks rule {}={}. Count was {}: {}", rule.getPath(), ruleName, rule.getMinCount(), size, rule.getSeverity());
                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Missing %s properties", rule.getMinCount()));
            }
        }

        return new Property(rule.getPath(), ruleName);
    }

    public Property checkMaxCount(PropertyRule rule, Object value) {
        final String ruleName = "maxCount";
        if (value instanceof Collection) {
            int size = 0;
            if (value instanceof Collection) {
                size = ((Collection) value).size();
            }

            if (size > rule.getMaxCount()) {
                logger.debug("Property {} breaks rule {}={}. Found {}: {}", rule.getPath(), ruleName, rule.getMaxCount(), size, rule.getSeverity());
                return new Property(rule.getPath(),
                        ruleName,
                        rule.getSeverity(),
                        String.format("Exceeding more than %s allowed properties", rule.getMinCount()));
            }
        }

        return new Property(rule.getPath(), ruleName);
    }

    public Property checkNodeKind(PropertyRule rule, Object value) {
        final String ruleName = String.format("NodeKind: %s", rule.getNodeKind());


        if ("Literal".equals(rule.getNodeKind())) {
            String message = "Property is not a %s";
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
        String foundClass = "Unknown";
        boolean ok = true;

        if (value instanceof Collection) {
            Collection list = (Collection) value;
            for (Object obj : list) {
                if (!(obj instanceof String || obj instanceof Map)) {
                    foundClass = obj.getClass().getSimpleName();
                    ok = false;
                    break;
                }
            }

        } else {
            if (value != null && !(value instanceof String || value instanceof Map)) {
                foundClass = value.getClass().getSimpleName();
                ok = false;
            }
        }

        if (ok) {
            return new Property(rule.getPath(), ruleName);
        } else {
            logger.debug("Property {} breaks rule {}. Found {} : {}", rule.getPath(), ruleName, foundClass, rule.getSeverity());

            return new Property(rule.getPath(),
                    ruleName,
                    rule.getSeverity(),
                    String.format("Property is not refering to a URI of class %s", rule.getClazz()));
        }
    }

    public Property checkConditional(PropertyRule rule, Map<String, Object> data, Object value) {
        final String ruleName = String.format("Conditional: %s", rule.getConditional());

        Object required = data.get(getPostfixName(rule.getConditional().getProperty()));
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
                    logger.debug("Property {} breaks rule {} : {}", rule.getPath(), ruleName, rule.getSeverity());
                    return new Property(rule.getPath(),
                            ruleName,
                            rule.getSeverity(),
                            String.format("Property should be present when %s is", rule.getConditional()));
                }
            }
        }


        return new Property(rule.getPath(), ruleName);

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
        if ((value instanceof Map || value instanceof String || value instanceof Number)) {
            return true;
        }

        return false;
    }
}
