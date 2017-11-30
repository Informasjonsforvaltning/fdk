package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class DCATCrawler {

    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://dcat.no/crawler/import/";

    public static final Resource ImportResource = model.createResource(NS + "ImportInformation");
    public static final Property source_url = model.createProperty(NS, "source-url");
}
