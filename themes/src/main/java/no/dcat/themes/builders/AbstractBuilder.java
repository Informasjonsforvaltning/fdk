package no.dcat.themes.builders;


import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class AbstractBuilder {

    private static Logger logger = LoggerFactory.getLogger(AbstractBuilder.class);

    public static String extractAsString(Resource resource, Property property) {
        try {
            Statement statement = resource.getProperty(property);
            if (statement != null) {
                if (statement.getObject().isLiteral()) {
                    return statement.getString();
                } else {
                    return statement.getObject().asResource().getURI();
                }
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", property, resource.getURI(), e);
        }
        return null;
    }


    public static List<String> extractMultipleStrings(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            result.add(statement.getObject().toString());
        }
        return result;
    }


    public static Map<String, String> extractLanguageLiteral(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            map.put(statement.getLanguage(), statement.getString());
        }
        return map;
    }

    public static List<String> extractTheme(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            result.add(statement.getObject().toString());
        }
        return result;
    }


    protected static SkosCode getCode(Map<String, SkosCode> codes, String locUri) {

        SkosCode result = codes.get(locUri);

        if (result == null) {
            logger.warn("Location with uri {} does not exist.", locUri);
        }

        return result;
    }

    protected static List<SkosCode> getCodes(Map<String, SkosCode> locations, List<String> locsUri) {
        List<SkosCode> result = new ArrayList();

        for (String locUri : locsUri) {
            SkosCode locCode = locations.get(locUri);

            if (locCode == null) {
                logger.info("Location with uri {} does not exist.", locsUri);
                continue;
            }

            result.add(locCode);
        }
        return result;
    }

    protected static Map<String, String> getTitlesOfCode(Map<String, Map<String, SkosCode>> allCodes, String type, String codeKey) {

        Map<String, SkosCode> codesOfType = allCodes.get(type);

        if (codesOfType == null) {
            logger.info("Codes of type {} does not exist.", type);
            return null;
        }

        SkosCode code = codesOfType.get(codeKey);
        if (code == null) {
            logger.info("Codes of type {} and key {} does not exist.", type, codeKey);
            return null;
        }

        return code.getPrefLabel();
    }
}
