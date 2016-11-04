package no.dcat.harvester.crawler.client;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;

/**
 * Class for retrieving rdf from an url.
 */
public class RetrieveRemote {
    public static Model remoteRDF(String url) {
        final Model model = ModelFactory.createDefaultModel();
        model.read(url);

        return model;
    }
}
