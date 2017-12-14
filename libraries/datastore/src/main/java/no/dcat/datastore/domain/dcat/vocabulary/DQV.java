package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

import java.util.Arrays;

public class DQV {
    private static final Model model = ModelFactory.createDefaultModel();

    public static final String NS = "http://www.w3.org/ns/dqvNS#";
    public static final String ISO = "http://iso.org/25012/2008/dataquality/";

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

        Resource result = Arrays.stream(dimensions).filter(dim -> dim.getURI().equals(dimension)).findFirst().get();

        return result;
    }
}
