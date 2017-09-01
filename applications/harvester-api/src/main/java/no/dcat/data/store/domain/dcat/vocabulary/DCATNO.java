package no.dcat.data.store.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;

/**
 * Created by bjg on 11.11.2016.
 * Norwegian extensions to DCAT standard
 * https://doc.difi.no/dcat-ap-no
 */
public class DCATNO {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://difi.no/dcatno#";

    public static String getURI() {
        return NS;
    }

    public static final Property accessRightsComment = model.createProperty(NS, "accessRightsComment");
}
