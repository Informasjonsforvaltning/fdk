package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

/**
 * Created by bjg on 05.03.2019.
 * Model elements for pointing to API descriptions in API catalog
 * Elements from draft DCAT revised editon 05 march 2019
 * These are kept separately from DCAT model elements, as they still have draft status.
 * Should be revised when the new version of DCAT standard is finalised.
 *
 * https://w3c.github.io/dxwg/dcat/
 *
 * Draft vocabulary:
 * https://raw.githubusercontent.com/w3c/dxwg/gh-pages/dcat/rdf/dcat.ttl
 *
 */
public class DCATapi {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://dcat.no/dcatapi/";

    public static String getURI() {
        return NS;
    }

    public static final Property accessService = model.createProperty(NS, "accessService");
    public static final Property DataDistributionService = model.createProperty(NS, "DataDistributionService");
    public static final Property endpointDescription = model.createProperty(NS, "endpointDescription");
}
