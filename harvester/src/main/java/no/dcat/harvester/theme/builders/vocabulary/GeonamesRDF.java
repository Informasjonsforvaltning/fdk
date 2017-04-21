package no.dcat.harvester.theme.builders.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * Vocabulary definitions from geonames.
 */
public class GeonamesRDF {
    public static final Property gnAlternateName = gnProperty("alternateName");
    public static final Property gnOfficialName = gnProperty("officialName");
    public static final Property gnShortName = gnProperty("shortName");

    private static Property gnProperty(String local) {
        return ResourceFactory.createProperty("http://www.geonames.org/ontology#", local);
    }
}
