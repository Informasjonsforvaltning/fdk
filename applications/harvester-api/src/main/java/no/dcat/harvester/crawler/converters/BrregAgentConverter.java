package no.dcat.harvester.crawler.converters;

import com.google.common.cache.LoadingCache;
import no.acando.xmltordf.Builder;
import no.acando.xmltordf.PostProcessingJena;
import no.acando.xmltordf.XmlToRdfAdvancedJena;
import no.dcat.harvester.theme.builders.vocabulary.EnhetsregisteretRDF;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.ResourceUtils;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
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
                //.uuidBasedIdInsteadOfBlankNodes("dcat://meta/") // generates uuid for blank nodes
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

            ClassLoader classLoader = Thread.currentThread().getContextClassLoader(); 

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
        NodeIterator orgiterator = model.listObjectsOfProperty(DCTerms.publisher);


        while (orgiterator.hasNext()) {
            RDFNode next = orgiterator.next();
            if (next.isURIResource()) {
                Resource orgresource = next.asResource();
                if (orgresource.getURI().contains("data.brreg.no")) {
                    collectFromUri(orgresource.getURI(), model, orgresource);
                } else {
                    String orgnr = getOrgnr(model, orgresource);
                    String url = publisherIdURI + orgnr + ".xml";
                    logger.trace("Used dct:identifier to collect from {}", url);
                    collectFromUri(url, model, orgresource);
                }
            } else {
                logger.warn("{} is not a resource. Probably really broken input!", next);
            }
        }


    }

    /* For each organisation, transform the RDF to match what we expect from it */

    protected void collectFromUri(String uri, Model model, Resource publisherResource) {
        if (!uri.endsWith(".xml")) {
            uri = uri.concat(".xml");
        }
        logger.debug("Collecting from URL {} using subject URI {}", uri, publisherResource.toString());
        try {
            if (brregCache != null) {

                String content = brregCache.get(new URL(uri));
                logger.trace("[model_before_conversion] {}", content);

                InputStream inputStream = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
                Model incomingModel = convert(inputStream);
                if (logger.isTraceEnabled()) {
                    OutputStream output = new ByteArrayOutputStream();
                    incomingModel.write(output, "TURTLE");
                    logger.trace("[model_after_conversion] \n{}", output.toString());
                }
                removeDuplicateProperties(model, incomingModel, FOAF.name); //TODO: remove all duplicate properties?

        /*        String orgnr = getOrgnr(model, publisherResource); */

        /*        if (orgnr != null) {
                    org.springframework.core.io.Resource canonicalNamesFile = new ClassPathResource("kanoniske.csv");
                    CSVParser parser = CSVParser.parse(canonicalNamesFile.getFile().toString(), CSVFormat.EXCEL);
                    for (CSVRecord line : parser) {
                        if (line.get(0).equals(orgnr) && publisherResource != null) { // Should check publisherResource, since all names will be removed if it is null
                            incomingModel.remove(publisherResource, FOAF.name, null);
                            incomingModel.add(publisherResource, FOAF.name, incomingModel.createLiteral(line.get(1), "nb"));
                        }
                    }
                } */

                processBlankNodes(incomingModel, uri);

                ResIterator subjects = incomingModel.listSubjectsWithProperty(EnhetsregisteretRDF.organisasjonsform);

                while (subjects.hasNext()) {
                    Resource subject = subjects.next();
                    String organisasjonsform =  subject.getProperty(EnhetsregisteretRDF.organisasjonsform).getString();
                    Statement overordnetEnhet = subject.getProperty(EnhetsregisteretRDF.overordnetEnhet);

                    if (organisasjonsform.equals(ORGANISASJONSLEDD) && overordnetEnhet != null) {

                        logger.trace("Found superior publisher: {}", overordnetEnhet.getObject());
                        String supOrgUri = String.format(publisherIdURI, overordnetEnhet.getObject().toString());
                        collectFromUri(supOrgUri, model, model.createResource(supOrgUri));
                    }
                }
                logger.trace(incomingModel.toString());
                model.add(incomingModel);
            } else {
                logger.warn("Unable to look up publisher {} - cache is not initiatilized.", uri);
            }


        } catch (Exception e) {
            logger.warn("Failed to look up publisher: {} reason {}", uri, e.getMessage(),e);
        }
    }

    /**
     * find forretningsadresse, naeringskode1, postadresse og institusjonellSektorkode
     * resources and change their blank nodes to a fixed uri
     */
    private void processBlankNodes(Model model, String resourceURI) {
        final String namespace = "http://data.brreg.no/meta/";
        final String[] properties = {
                "forretningsadresse",
                "postadresse",
                "naeringskode1",
                "institusjonellSektorkode"
        };

        if (resourceURI.endsWith(".xml")) {
            resourceURI = resourceURI.substring(0,resourceURI.indexOf(".xml"));
        }

        for (String localName : properties ) {

            Property property = model.getProperty(namespace, localName);
            NodeIterator nodes = model.listObjectsOfProperty(property);
            if (nodes.hasNext()) {
                RDFNode blankNode = nodes.next();
                if (blankNode.isResource() && blankNode.isAnon()) {
                    Resource resource = blankNode.asResource();
                    String newUri = resourceURI + "/" + localName;
                    logger.debug("Renames {} blank node {} to {}",resourceURI, resource.getId(), newUri);
                    ResourceUtils.renameResource(resource, newUri );
                }
            }

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

    private String getOrgnr(Model model, Resource orgresource) {
        NodeIterator identiterator = model.listObjectsOfProperty(orgresource, DCTerms.identifier);
        // TODO: deal with the possibility of multiple dct:identifiers?
        if (identiterator.hasNext()) {
            String orgnr = identiterator.next().asLiteral().getValue().toString();
            return orgnr.replaceAll("\\s", "");
        } else {
            logger.debug("Found no identifier for {}", orgresource.getURI());
        }
        return null;
    }

    
}
