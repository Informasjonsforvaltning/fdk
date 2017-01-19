package no.dcat.harvester.crawler.client;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * Class for retrieving rdf from an url.
 */
public class RetrieveModel {
    private static final Logger logger = LoggerFactory.getLogger(RetrieveModel.class);

    public static Model remoteRDF(String url) {
        final Model model = ModelFactory.createDefaultModel();
        model.read(url);

        return model;
    }

    public static Model localRDF(String url) {
        final Model model = ModelFactory.createDefaultModel();

        Resource resource = new ClassPathResource(url);
        try {
            logger.info("Remapping of url from {} to {}",url, resource.getURL().toString());

            model.read(resource.getInputStream(), url);
        } catch (Exception e) {
            logger.error("Unable to load {}", url, e);
        }

        return model;
    }
}
