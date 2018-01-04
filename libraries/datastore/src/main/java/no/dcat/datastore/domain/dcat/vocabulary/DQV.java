package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Optional;

public class DQV {
    private static Logger logger = LoggerFactory.getLogger(DQV.class);

    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.w3.org/ns/dqvNS#";
    public static final String ISO = "http://iso.org/25012/2008/dataquality/"; // TODO - this is not an official uri

    public static final Property hasQualityAnnotation = model.createProperty(NS, "hasQualityAnnotation");
    public static final Property inDimension = model.createProperty(NS, "inDimension");

    public static final Resource QualityAnnotation = model.createResource(DQV.NS + "QualityAnnotation");

    public static final Resource Accuracy = model.createResource(ISO + "Accuracy");
    public static final Resource Availability = model.createResource(ISO + "Availability");
    public static final Resource Completeness = model.createResource(ISO + "Completeness");
    public static final Resource Currentness = model.createResource(ISO + "Currentness");
    public static final Resource Relevance = model.createResource(ISO + "Relevance");

    public static final Resource[] dimensions = { Accuracy, Availability, Completeness, Currentness, Relevance };

    public static final Resource resolveDimensionResource(String dimension) {

        if (dimension == null) {
            return null;
        }

        if (dimension.startsWith("iso:")) {
            dimension = dimension.replace("iso:", ISO );
        }

        final String dimensionUri = dimension;

        try {
            return Arrays.stream(dimensions).filter(dim -> dim.getURI().equals(dimensionUri)).findFirst().get();
        } catch (Exception e) {
            logger.warn("Cannot resolve dimension resource with uri: {}", dimension);
            return null;
        }

    }
}
