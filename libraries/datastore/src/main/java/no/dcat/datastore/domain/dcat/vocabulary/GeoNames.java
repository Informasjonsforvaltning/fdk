package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class GeoNames {

    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.geonames.org/ontology#";

    public static String getURI() {
        return NS;
    }

    public static final Resource NAMESPACE = model.createResource(NS);

    public static final Property name = model.createProperty(NS, "name");

    public static final Property officialName = model.createProperty(NS, "officialName");

}
