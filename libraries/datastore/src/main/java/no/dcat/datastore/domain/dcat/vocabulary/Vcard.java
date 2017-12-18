package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

/**
 * Vocabulary for vcard.
 */
public class Vcard {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.w3.org/2006/vcard/ns#";

    public static final Property fn = model.createProperty(NS, "fn");

    public static final Property hasEmail = model.createProperty(NS, "hasEmail");

    public static final Property hasTelephone = model.createProperty(NS, "hasTelephone");

    public static final Property organizationName = model.createProperty(NS, "organization-name");

    public static final Property organizationUnit = model.createProperty(NS, "organization-unit");

    public static final Property hasURL = model.createProperty(NS, "hasURL");
}


