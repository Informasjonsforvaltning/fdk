package no.dcat.harvester.crawler.converters;

import com.google.common.cache.LoadingCache;
import no.acando.xmltordf.Builder;
import no.acando.xmltordf.PostProcessingJena;
import no.acando.xmltordf.XmlToRdfAdvancedJena;
import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.harvester.theme.builders.vocabulary.EnhetsregisteretRDF;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.ResourceUtils;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BrregAgentConverter {

    public String publisherIdURI = Publisher.PUBLISHERID_ENHETSREGISTERET_URI;
    private final XmlToRdfAdvancedJena xmlToRdfObject;
    private final LoadingCache<URL, String> brregCache;
    private HashMap<String, String> canonicalNames = new HashMap<>();

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

        org.springframework.core.io.Resource canonicalNamesFile = new ClassPathResource("kanoniske.csv");
        Reader in = null;
        Iterable<CSVRecord> records = null;
        try {
            in = new BufferedReader(new InputStreamReader(canonicalNamesFile.getInputStream()));
            records = CSVFormat.EXCEL.parse(in);
        } catch (IOException e) {
            logger.error("Could not read canonical names: {}", e.getMessage());
        }

        if (records != null) {
            for (CSVRecord line : records) {
                canonicalNames.put(line.get(0), line.get(1));
            }

            logger.debug("Read {} canonical names from file.", canonicalNames.size());
        }

    }

    private Model convert(InputStream inputStream) throws IOException, SAXException, ParserConfigurationException {
        PostProcessingJena postProcessingJena = xmlToRdfObject.convertForPostProcessing(inputStream);
        return convert(postProcessingJena);
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
                    .getModel();

            applyNamespaces(extractedModel);

            return extractedModel;
        } catch (Exception e) {
            logger.error("Error converting PostProcessing", e);
        }

        return extractedModel;
    }

    public void collectFromModel(Model model) {
        processAgents(model, DCTerms.publisher);
        processAgents(model, DCTerms.creator);

        processAgentHierarchy(model);
    }

    private void processAgents(Model model, Property agentProperty) {
        NodeIterator orgiterator = model.listObjectsOfProperty(agentProperty);

        while (orgiterator.hasNext()) {
            RDFNode next = orgiterator.next();
            if (next.isURIResource()) {
                Resource orgresource = next.asResource();
                if (orgresource.getURI().contains("data.brreg.no")) {
                    collectFromUri(orgresource.getURI(), model, orgresource);
                } else {
                    String orgnr = getOrgnrFromIdentifier(model, orgresource);
                    String url = String.format(publisherIdURI, orgnr, ".xml");
                    logger.info("Used dct:identifier to lookup publisher {} from {}", orgresource.getURI(), url);
                    collectFromUri(url, model, orgresource);
                }
            } else {
                logger.warn("{} is not a resource. Probably really broken input!", next);
            }
        }
    }

    void processAgentHierarchy(Model model) {
        List<Publisher> publishers = new PublisherBuilder(model).build();

        final Map<String, Publisher> publisherMap = new HashMap<>();
        publishers.forEach(publisher -> {
            if (publisher.getId() == null || publisher.getId().isEmpty()) {
                publisher.setId(publisher.getName());
            } else {
                if (publisherMap.containsKey(publisher.getId())) {
                    logger.error("Publisher {} is already registered and will be overwritten(duplicates in data?)", publisher.getId());
                }
            }
            publisherMap.put(publisher.getId(), publisher);
        });

        publishers.forEach(publisher -> {
            publisher.setOrgPath(extractOrganizationPath(publisher, publisherMap));
            Resource publisherResource = model.getResource(publisher.getUri());
            publisherResource.addProperty(DCATNO.organizationPath, publisher.getOrgPath());
        });
    }

    /**
     * If publisher of dataset is an organisation, but does not have an URI from Enhetsregisteret
     * (central coordinating register of legal entities)
     * then change the uri to point to Actor resource collected from Enhetstregisteret
     *
     * @param dataset  the dataset to be examined
     *
     * @param masterPublisherResource the Actor resource collected from Enhetsregisteret
     */
    private void substitutePublisherResourceInDataset(Resource dataset, Resource nonStandardPublisherResource, Resource masterPublisherResource) {

        logger.warn("Dataset {} has dct:publisher with incorrect URI: {}, which is replaced by URI: {}",
                dataset.getURI(), nonStandardPublisherResource.getURI(), masterPublisherResource.getURI());

        dataset.removeAll(DCTerms.publisher);
        dataset.addProperty(DCTerms.publisher, masterPublisherResource);

    }

    String extractOrganizationPath(Publisher publisher, Map<String, Publisher> publisherMap) {
        String prefix = "";
        if (publisher != null) {
            if (publisher.getOverordnetEnhet() != null && !publisher.getOverordnetEnhet().isEmpty() && !"/".equals(publisher.getOverordnetEnhet())) {
                Publisher overordnetEnhet = publisherMap.get(publisher.getOverordnetEnhet());
                prefix = extractOrganizationPath(overordnetEnhet, publisherMap);
            } else {
                if (publisher.isValid()) {
                    if (publisher.getOrganisasjonsform() != null) {
                        String orgForm = publisher.getOrganisasjonsform();

                        if ("STAT".equals(orgForm) || "SF".equals(orgForm)) {
                            prefix = "/STAT";
                        } else if ("FYLK".equals(orgForm)) {
                            prefix = "/FYLKE";
                        } else if ("KOMM".equals(orgForm)) {
                            prefix = "/KOMMUNE";
                        } else if ("IKS".equals(orgForm)) {
                            prefix = "/ANNET";
                        } else {
                            prefix = "/PRIVAT";
                        }
                    } else {
                        prefix = "/ANNET";
                    }
                } else {
                    prefix = "/ANNET";
                }
            }


            return prefix + "/" + (publisher.getId().startsWith("http") ? publisher.getName() : publisher.getId());
        }

        return null;
    }

    /* For each organisation, transform the RDF to match what we expect from it */

    protected void collectFromUri(String uri, Model model, Resource publisherResource) {

        if (!uri.endsWith(".xml")) {
            if (uri.endsWith(".json")) {
                uri = uri.replaceAll(".json", ".xml");
            } else {
                uri = uri.concat(".xml");
            }
        }

        String masterPublisherUri = uri.substring(0, uri.length() - ".xml".length());

        logger.debug("Collecting from URL {} using subject URI {}", uri, publisherResource.toString());
        try {
            if (brregCache != null) {

                String organisationNumber = getOrgnrFromIdentifier(model, publisherResource);
                String originalOrganisationName = getOrgName(publisherResource);

                if (organisationNumber == null) {
                    organisationNumber = getOrgnrFromUri(uri);
                    if (organisationNumber != null) {
                        model.add(publisherResource, DCTerms.identifier, organisationNumber);
                    }
                }

                if (organisationNumber == null) {
                    logger.warn("Publisher does not have a organisation number [{}]", uri);
                }
                String content = null;
                try {
                    content = brregCache.get(new URL(uri));
                } catch (IOException e) {
                    // hack to not overload data.brreg.no
                    Thread.sleep(200);
                    content = brregCache.get(new URL(uri));
                }

                logger.trace("[model_before_conversion] {}", content);

                InputStream inputStream = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
                Model masterDataModel = convert(inputStream);

                if (masterPublisherUri.equals(publisherResource.getURI())) {
                    //later merge of model resulted in publisher having two names, therefore we make sure it is removed
                    removeDuplicateProperties(model, masterDataModel, FOAF.name); //TODO: remove all duplicate properties?
                } else {
                    // replace old uri with masterPublisher uri

                    Resource masterPublisherResource = masterDataModel.getResource(masterPublisherUri);

                    //exchange non-standard uri for organization number with standard one
                    ResIterator datasetIterator = model.listResourcesWithProperty(DCTerms.publisher, publisherResource);
                    while (datasetIterator.hasNext()) {
                        Resource dataset = datasetIterator.next().asResource();
                        substitutePublisherResourceInDataset(dataset, publisherResource, masterPublisherResource);
                    }

                    //add missing attributes to master publisher received from Enhetsregisteret
                    masterPublisherResource.addProperty(DCTerms.identifier, organisationNumber);

                    //remove no longer used publisher, since it will not produce a valid orgpath

                    // remove statements where resource is subject
                    model.removeAll(publisherResource, null, (RDFNode) null);
                    // remove statements where resource is object
                    model.removeAll(null, null, publisherResource);

                    // make sure we use master publisher as resource from now on
                    publisherResource = masterPublisherResource;
                }

                lookupPublisherHierarchy(model, masterDataModel);
                processBlankNodes(masterDataModel, uri);

                logger.debug("Adding {} triples to the model for {}", masterDataModel.size(), uri);

                // merge master data into model. The model will only be updated if model and master have same publisher uri.
                model.add(masterDataModel);

                addPreferredOrganisationName(model, publisherResource, organisationNumber, originalOrganisationName);

                model.addLiteral(publisherResource, DCTerms.valid, true);

            } else {
                model.addLiteral(publisherResource, DCTerms.valid, false);
                logger.warn("Unable to lookup publisher {} - cache is not initiatilized.", uri);
            }

        } catch (Exception e) {
            model.addLiteral(publisherResource, DCTerms.valid, false);
            logger.warn("Failed to lookup publisher: {}. Reason {}", uri, e.getMessage());
        }
    }

    void addPreferredOrganisationName(Model model, Resource publisherResource, String organisationNumber, String originalOrganisationName) {
        String preferredName = null;

        if (originalOrganisationName != null) {
            // use original organisation name in prefLabel
            preferredName = originalOrganisationName;
        }

        if (organisationNumber != null && canonicalNames.containsKey(organisationNumber)) {
            // Name hack: use predefined organization name from canonical names table
            preferredName = canonicalNames.get(organisationNumber);
        }

        if (preferredName != null) {
            model.add(publisherResource, SKOS.prefLabel, model.createLiteral(preferredName, "no"));
        }
    }

    private void lookupPublisherHierarchy(Model model, Model masterRegistryModel) {
        ResIterator subjects = masterRegistryModel.listSubjectsWithProperty(EnhetsregisteretRDF.organisasjonsform);

        while (subjects.hasNext()) {
            Resource subject = subjects.next();
            String organisasjonsform = subject.getProperty(EnhetsregisteretRDF.organisasjonsform).getString();
            Statement overordnetEnhet = subject.getProperty(EnhetsregisteretRDF.overordnetEnhet);

            if (overordnetEnhet != null) {

                logger.trace("Found superior publisher: {}", overordnetEnhet.getObject());
                String supOrgUri = String.format(publisherIdURI, overordnetEnhet.getObject().toString());
                collectFromUri(supOrgUri, model, model.createResource(supOrgUri));
            }
        }
    }

    // http://data.brreg.no/enhetsregisteret/enhet/974760983

    String getOrgnrFromUri(String uri) {
        Pattern p = Pattern.compile("(\\d{9})");
        Matcher m = p.matcher(uri);
        String orgnr = null;

        if (m.find()) {
            orgnr = m.group(1);
        }
        return orgnr;
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
            resourceURI = resourceURI.substring(0, resourceURI.indexOf(".xml"));
        }

        for (String localName : properties) {

            Property property = model.getProperty(namespace, localName);
            NodeIterator nodes = model.listObjectsOfProperty(property);
            if (nodes.hasNext()) {
                RDFNode blankNode = nodes.next();
                if (blankNode.isResource() && blankNode.isAnon()) {
                    Resource resource = blankNode.asResource();
                    String newUri = resourceURI + "/" + localName;
                    logger.debug("Renames {} blank node {} to {}", resourceURI, resource.getId(), newUri);
                    ResourceUtils.renameResource(resource, newUri);
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

            Resource incomingResource = incomingModelIterator.next();
            Resource existingResource = existingModel.getResource(incomingResource.getURI());

            Statement oldProperty = existingResource.getProperty(property);
            Statement officialProperty = incomingResource.getProperty(property);

            if (oldProperty == null) {
                if (officialProperty != null) {
                    logger.debug("Publisher name: is missing from dataset. Found " + officialProperty.getString() + " which is added to dataset. for resource " + incomingResource.getURI());
                }
            } else {
                if (officialProperty != null) {
                    logger.debug("Publisher name: found " + oldProperty.getString() + " which is replaced with " + officialProperty.getString() + " for resource " + incomingResource.getURI());
                    existingResource.removeAll(property);
                }
            }
        }
    }

    private static void applyNamespaces(Model extractedModel) {

        extractedModel.setNsPrefix("foaf", FOAF.getURI());
    }

    private String getOrgName(Resource resource) {
        Statement nameStatement = resource.getProperty(FOAF.name);
        if (nameStatement != null) {
            return nameStatement.getObject().asLiteral().getString();
        }

        return null;
    }

    private String getOrgnrFromIdentifier(Model model, Resource orgresource) {
        NodeIterator identIterator = model.listObjectsOfProperty(orgresource, DCTerms.identifier);
        // TODO: deal with the possibility of multiple dct:identifiers?
        if (identIterator.hasNext()) {
            String orgnr = identIterator.next().asLiteral().getValue().toString();
            return orgnr.replaceAll("\\s", "");
        } else {
            logger.debug("Found no identifier for {}", orgresource.getURI());
        }
        return null;
    }


}
