package no.dcat;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

/**
 * Vocabulary definition for the
 * <a href="https://www.w3.org/ns/adms"> ADMS Recommendation</a>.
 */
public class ADMS {
    /**
     * The namespace of the ADMS vocabulary as a string
     */
    public static final String uri = "https://www.w3.org/ns/adms#";
    /**
     * The RDF model that holds the ADMS entities
     */
    private static final Model m = ModelFactory.createDefaultModel();
    /**
     * The namespace of the ADMS vocabulary
     */
    public static final Resource NAMESPACE = m.createResource(uri);
    /* ##########################################################
     * Defines ADMS Classes
       ########################################################## */
    public static final Resource AssetRepository = m.createResource(uri + "AssetRepository ");

    public static final Property AssetRepoAsProperty = m.createProperty(uri + "AssetRepository ");


    /**
     * Returns the namespace of the ADMS schema as a string
     *
     * @return the namespace of the ADMS schema
     */
    public static String getURI() {
        return uri;
    }

}
