package no.dcat.harvester.dcat.domain.theme.builders.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * Vocabulary definitions from Skos.
 */
public class SkosRDF {
    public static final Property skosPreflabel = skosProperty("prefLabel");

    private static Property skosProperty(String local) {
        return ResourceFactory.createProperty("http://www.w3.org/2004/02/skos/core#", local);
    }
}
