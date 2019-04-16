package no.ccat.service;

import no.ccat.SKOSNO;
import no.ccat.common.model.ContactPoint;
import no.ccat.common.model.Definition;
import no.ccat.common.model.Source;
import no.ccat.model.ConceptDenormalized;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.HarvestMetadataUtil;
import no.dcat.shared.Publisher;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.Reader;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;

/*
    Transform RDF/Turtle into our domain model (ConceptDenormalized and friends)
*/
@Service
public class RDFToModelTransformer {

    public static final String defaultLanguage = "nb";
    private static final Logger logger = LoggerFactory.getLogger(RDFToModelTransformer.class);
    @Value("${application.apiRootExternalURL}")
    public String externalApiRoot;
    @Value("${application.conceptsPath}")
    public String conceptsPath;

    private ConceptBuilderService conceptBuilderService;
    private ConceptDenormalizedRepository conceptDenormalizedRepository;

    @Autowired
    public RDFToModelTransformer(ConceptBuilderService conceptBuilderService, ConceptDenormalizedRepository conceptDenormalizedRepository) {
        this.conceptBuilderService = conceptBuilderService;
        this.conceptDenormalizedRepository = conceptDenormalizedRepository;
    }

    public static Definition extractDefinition(Resource resource) {
        Definition definition = new Definition();
        definition.setText(new HashMap());
        definition.setRemark(new HashMap<>());
        Source source = new Source();
        definition.setSource(source);

        List<Resource> betydningsbeskivelses = getNamedSubPropertiesAsListOfResources(resource, SKOSNO.betydningsbeskrivelse);

        for (Resource betydningsbeskrivelse : betydningsbeskivelses) {
            //We may need to merge the different language strings from the different betydningsbeskrivelses
            Map<String, String> definitionAsLanguageLiteral = extractLanguageLiteral(betydningsbeskrivelse, RDFS.label);
            if (definitionAsLanguageLiteral != null) {
                definition.getText().putAll(definitionAsLanguageLiteral);
            }

            Map<String, String> noteAsLanguageLiteral = extractLanguageLiteral(betydningsbeskrivelse, SKOS.scopeNote);
            if (noteAsLanguageLiteral != null) {
                definition.getRemark().putAll(noteAsLanguageLiteral);
            }

            Map<String, String> sourceAsLanguageLiteral = extractLanguageRDFSLabelFromLabel(betydningsbeskrivelse, DCTerms.source);
            if (sourceAsLanguageLiteral != null) {
                if (source.getPrefLabel() == null) {
                    source.setPrefLabel(new HashMap());
                }

                definition.getSource().getPrefLabel().putAll(sourceAsLanguageLiteral);
            }
        }
        return definition;
    }

    public static List<Map<String, String>> extractLanguageLiteralFromListOfLabels(Resource resource, Property property) {
        List<Map<String, String>> result = new ArrayList();

        Map<String, String> tmp = extractLanguageLiteralFromLabel(resource, property);
        if (tmp != null) {
            result.add(tmp);
        }
        return result;
    }


    protected static String extractPublisherOrgNrFromStmt(Resource publisherResource) {
        try {
            URL url = new URL(publisherResource.getURI());
            String[] parts = url.getPath().split("/");

            return (parts[parts.length - 1]);
        } catch (Exception e) {
            logger.error("Failed while trying to parse URI for publisher {}", publisherResource.getURI());
            return null;
        }
    }

    public static Map<String, String> extractLanguageLiteral(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();

        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String language = statement.getLanguage();
            if (language == null || language.isEmpty()) {
                language = defaultLanguage;
            }
            if (statement.getString() != null && !statement.getString().isEmpty()) {
                map.put(language, statement.getString());
            }
        }

        if (map.keySet().size() > 0) {
            return map;
        }

        return null;
    }

    public static Map<String, String> extractLanguageRDFSLabelFromLabel(Resource resource, Property property) {
        Statement stmt = resource.getProperty(property);
        if (stmt == null) {
            return null;
        }
        RDFNode node = stmt.getObject();
        Resource subResource = node.asResource();

        return extractLanguageLiteral(subResource, RDFS.label);
    }


    public static Map<String, String> extractLanguageLiteralFromLabel(Resource resource, Property property) {
        Statement stmt = resource.getProperty(property);
        if (stmt == null) {
            return null;
        }
        RDFNode node = stmt.getObject();
        Resource subResource = node.asResource();

        return extractLanguageLiteral(subResource, SKOSXL.literalForm);
    }

    public static List<Resource> getNamedSubPropertiesAsListOfResources(Resource source, Property target) {
        List<Resource> resources = new ArrayList<>();
        StmtIterator iterator = source.listProperties(target);
        while (iterator.hasNext()) {
            Statement stmt = iterator.next();
            resources.add(stmt.getObject().asResource());
        }
        return resources;
    }

    public List<ConceptDenormalized> getConceptsFromStream(Reader reader) {
        final Model model = ModelFactory.createDefaultModel();
        model.read(reader, null, "TURTLE");//Base and lang is just untested dummy values
        return getConceptsFromModel(model);
    }

    public List<ConceptDenormalized> getConceptsFromModel(Model model) {

        List<ConceptDenormalized> concepts = new ArrayList<>();

        ResIterator conceptIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);

        while (conceptIterator.hasNext()) {
            Resource conceptResource = conceptIterator.nextResource();
            concepts.add(extractConceptFromModel(conceptResource));
        }
        return concepts;
    }

    public ConceptDenormalized extractConceptFromModel(Resource conceptResource) {
        ConceptDenormalized concept = new ConceptDenormalized();
        ConceptDenormalized existingConcept = conceptDenormalizedRepository.findByIdentifier(conceptResource.getURI());

        Date harvestDate = new Date();
        HarvestMetadata oldMetadata = null;
        if (existingConcept != null) {
            oldMetadata = existingConcept.getHarvest();
        }
        HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(oldMetadata, harvestDate, false);

        String id = existingConcept != null ? existingConcept.getId() : UUID.randomUUID().toString();

        concept.setId(id);

        concept.setHarvest(harvest);

        concept.setUri(buildLocalUri(id));//So that URI is actually addressable into our system.

        concept.setIdentifier(conceptResource.getURI());

        concept.setPublisher(extractPublisher(conceptResource, DCTerms.publisher));

        concept.setSubject(extractLanguageLiteral(conceptResource, DCTerms.subject));

        concept.setExample(extractLanguageLiteral(conceptResource, SKOS.example));

        concept.setPrefLabel(extractLanguageLiteralFromLabel(conceptResource, SKOSXL.prefLabel));

        concept.setHiddenLabel(extractLanguageLiteralFromListOfLabels(conceptResource, SKOSXL.hiddenLabel));

        concept.setAltLabel(extractLanguageLiteralFromListOfLabels(conceptResource, SKOSXL.altLabel));

        concept.setDefinition(extractDefinition(conceptResource));

        concept.setContactPoint(extractContactPoint(conceptResource));

        return concept;
    }

    private ContactPoint extractContactPoint(Resource resource) {
        ContactPoint contactPoint = new ContactPoint();

        try {
            Statement propertyStmnt = resource.getProperty(DCAT.contactPoint);
            if (propertyStmnt == null) {
                return null;
            }

            Resource contactPointResource = propertyStmnt.getObject().asResource();

            Statement phoneStatement = contactPointResource.getProperty(VCARD4.hasTelephone);
            String parsedPhoneNumber = parseURIFromStatement(phoneStatement);
            contactPoint.setTelephone(parsedPhoneNumber);

            Statement emailStatement = contactPointResource.getProperty(VCARD4.hasEmail);
            String parsedEmailAddress = parseURIFromStatement(emailStatement);
            contactPoint.setEmail(parsedEmailAddress);

        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCAT.contactPoint, resource.getURI(), e);
        }

        return contactPoint;
    }

    private String parseURIFromStatement(Statement statement) {
        if (statement.getObject().isResource() && statement.getResource().isURIResource()) {
            try {
                URI uri = new URI(statement.getResource().getURI());
                return uri.getSchemeSpecificPart();
                //contactPoint.setEmail(uri.getSchemeSpecificPart());
            } catch (URISyntaxException use) {
                logger.error("Email URI not parsable :" + statement.getObject().toString());
            }
        }
        return "";
    }

    private String buildLocalUri(String id) {
        return externalApiRoot + conceptsPath + "/" + id;
    }

    public Publisher extractPublisher(Resource resource, Property property) {
        try {
            Statement propertyStmnt = resource.getProperty(property);
            if (propertyStmnt != null) {
                Resource publisherResource = resource.getModel().getResource(propertyStmnt.getObject().asResource().getURI());
                String orgNr = extractPublisherOrgNrFromStmt(publisherResource);
                return conceptBuilderService.lookupPublisher(orgNr);
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCTerms.publisher, resource.getURI(), e);
        }

        return null;
    }
}
