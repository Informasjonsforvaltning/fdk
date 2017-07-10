package no.dcat.themes.builders.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * Vocabulary definitions from Fellesdatakatalog
 * @author Marcus Gustafson
 */
public class FdkRDF {
    public static final Property atAuthorityName = atProperty("authority-code");
    public static final Property atPreflabel = atProperty("prefLabel");
    public static final Property atTableId = atProperty("table.id");
    public static final Property atVersionNumber = atProperty("table.version.number");

    public static final Property rdfsLabel = rdfsProperty("label");

    public static final Property owlVersionInfo = owlProperty("versionInfo");

    private static Property atProperty(String local) {
        return ResourceFactory.createProperty("http://publications.europa.eu/ontology/authority/", local);
    }

    private static Property rdfsProperty(String local) {
        return ResourceFactory.createProperty("http://www.w3.org/2000/01/rdf-schema#", local);
    }

    private static Property owlProperty(String local) {
        return ResourceFactory.createProperty("http://www.w3.org/2002/07/owl#", local);
    }
}
