package no.dcat.harvester.crawler.converters;

import com.google.common.cache.LoadingCache;
import no.acando.xmltordf.Builder;
import no.acando.xmltordf.PostProcessingJena;
import no.acando.xmltordf.XmlToRdfAdvancedJena;
import no.dcat.harvester.dcat.domain.theme.builders.vocabulary.EnhetsregisteretRDF;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class BrregAgentConverter {

    public String publisherIdURI = Publisher.PUBLISHERID_ENHETSREGISTERET_URI;
    public static final String ORGANISASJONSLEDD = "ORGL";
    private final XmlToRdfAdvancedJena xmlToRdfObject;
    private final LoadingCache<URL, String> brregCache;

    private static final Logger logger = LoggerFactory.getLogger(BrregAgentConverter.class);

    public BrregAgentConverter(LoadingCache<URL, String> brregCache) {
        this.brregCache = brregCache;
        logger.debug("start BrregAgentConverter xmlToRdfObject");
        xmlToRdfObject = Builder.getAdvancedBuilderJena()
                .setBaseNamespace("http://data.brreg.no/meta/", Builder.AppliesTo.bothElementsAndAttributes)
                .convertComplexElementsWithOnlyAttributesAndSimpleTypeChildrenToPredicate(true)
                .convertComplexElementsWithOnlyAttributesToPredicate(true)
                .renameElement("http://data.brreg.no/meta/navn", FOAF.name.getURI())
                .renameElement("http://data.brreg.no/meta/enhet", FOAF.Agent.getURI()).build();
        logger.debug("end ");
    }

    private Model convert(InputStream inputStream) {
        try {
            PostProcessingJena postProcessingJena = xmlToRdfObject.convertForPostProcessing(inputStream);
            return convert(postProcessingJena);
        } catch (Exception e) {
            logger.error("Error converting InputStream", e);
            return ModelFactory.createDefaultModel();
        }
    }

    /**
     * Applies the rules found in the referred SPARQL files for post processing of the official enhetsregisteret data.
     *
     * @param postProcessing the postprocessing hook
     * @return the extracted model
     */
    private Model convert(PostProcessingJena postProcessing) {
        Model extractedModel = ModelFactory.createDefaultModel();
        try {

            ClassLoader classLoader = getClass().getClassLoader();

            extractedModel = postProcessing
                    .mustacheTransform(classLoader.getResourceAsStream("brreg/transforms/00001.qr"), new Object())
                    .mustacheTransform(classLoader.getResourceAsStream("brreg/transforms/00010.qr"), new Object())
                    //	.mustacheExtract(classLoader.getResourceAsStream("brreg/constructs/00001.qr"), new Object())
                    .getModel();

            applyNamespaces(extractedModel);

            return extractedModel;
        } catch (Exception e) {
            logger.error("Error converting PostProcessing", e);
        }

        return extractedModel;
    }

    public void collectFromModel(Model model) {
        NodeIterator iterator = model.listObjectsOfProperty(DCTerms.publisher);

        while (iterator.hasNext()) {
            RDFNode next = iterator.next();
            if (next.isURIResource() && next.asResource().getURI().contains("data.brreg.no")) {
                String uri = next.asResource().getURI();
                collectFromUri(uri, model);
            } else {
                logger.trace("{} either is not a resource or does not contain \"data.brreg.no\"", next);
            }
        }


    }

    protected void collectFromUri(String uri, Model model) {
        if (!uri.endsWith(".xml")) {
            uri = uri.concat(".xml");
        }

        try {
            if (brregCache != null) {

                String content = brregCache.get(new URL(uri));
                logger.trace("[model_before_conversion] {}", content);

                InputStream inputStream = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
                Model incomingModel = convert(inputStream);

                logger.trace("[model_after_conversion] {}", incomingModel);
                removeDuplicateProperties(model, incomingModel, FOAF.name); //TODO: remove all duplicate properties?

                ResIterator subjects = incomingModel.listSubjectsWithProperty(EnhetsregisteretRDF.organisasjonsform);

                while (subjects.hasNext()) {
                    Resource subject = subjects.next();
                    String organisasjonsform =  subject.getProperty(EnhetsregisteretRDF.organisasjonsform).getString();
                    Statement overordnetEnhet = subject.getProperty(EnhetsregisteretRDF.overordnetEnhet);

                    if (organisasjonsform.equals(ORGANISASJONSLEDD) && overordnetEnhet != null) {

                        logger.trace("Found superior publisher: {}", overordnetEnhet.getObject());
                        collectFromUri(String.format(publisherIdURI, overordnetEnhet.getObject().toString()), model);
                    }
                }

                model.add(incomingModel);
            } else {
                logger.warn("Unable to look up publisher {} - cache is not initiatilized.", uri);
            }


        } catch (Exception e) {
            logger.warn("Failed to look up publisher: {} reason {}", uri, e.getMessage(),e);
        }
    }

    /**
     * Removes duplicated properties in @existingModel@ if they are found in @incomingModel@.
     *
     * @param existingModel the existing model, loaded from url
     * @param incomingModel the incoming model with official properties collected from Enhetsregisteret
     * @param property      the property to remove
     */
    private void removeDuplicateProperties(Model existingModel, Model incomingModel, Property property) {
        ResIterator incomingModelIterator = incomingModel.listResourcesWithProperty(property);

        while (incomingModelIterator.hasNext()) {
            // was
            /*
			Resource existingResource = existingModel.getResource(incomingModelIterator.next().getURI());
			existingResource.removeAll(property);
			*/

            Resource incomingResource = incomingModelIterator.next();
            Resource existingResource = existingModel.getResource(incomingResource.getURI());

            Statement oldProperty = existingResource.getProperty(property);
            Statement officialProperty = incomingResource.getProperty(property);

            if (oldProperty == null) {
                if (officialProperty == null) {
                    // do nothing
                } else {
                    logger.debug("Publisher name: is missing from dataset. Found " + officialProperty.getString() + " which is added to dataset. for resource " + incomingResource.getURI());
                }
            } else {
                if (officialProperty == null) {
                    // keep existing property
                } else {
                    logger.debug("Publisher name: found " + oldProperty.getString() + " which is replaced with " + officialProperty.getString() + " for resource " + incomingResource.getURI());
                    existingResource.removeAll(property);
                }
            }
        }
    }

    private static void applyNamespaces(Model extractedModel) {

        extractedModel.setNsPrefix("foaf", FOAF.getURI());
    }

    // Only used for unittest purposes.
    protected void setPublisherIdURI(String publisherIdURI) {
        this.publisherIdURI = publisherIdURI;
    }
}
