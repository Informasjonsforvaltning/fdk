package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

/**
 * Vocabulary for asset description metadata schema.
 *
 * @lenke http://www.w3.org/TR/vocab-adms
 */
public class ADMS {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.w3.org/ns/adms#";

    public static final Property identifier = model.createProperty(NS, "identifier");
    public static final Property sample = model.createProperty(NS, "sample");
}
