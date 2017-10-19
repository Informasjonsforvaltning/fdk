package no.difi.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

public class DQV {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.w3.org/ns/dqvNS#";

    public static final Property hasQualityAnnotation = model.createProperty(NS, "hasQualityAnnotation");
    public static final Property inDimension = model.createProperty(NS, "inDimension");

}
