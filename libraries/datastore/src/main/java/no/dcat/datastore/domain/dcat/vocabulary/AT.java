package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

public class AT {
    private static final Model model = ModelFactory.createDefaultModel();
    public static final String NS = "http://publications.europa.eu/ontology/authority/";

    public static final Property authorityCode = model.createProperty(NS, "authority-code");
}

