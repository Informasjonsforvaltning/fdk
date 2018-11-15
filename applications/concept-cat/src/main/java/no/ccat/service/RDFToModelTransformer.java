package no.ccat.service;

import no.ccat.SKOSNO;
import no.ccat.model.ConceptDenormalized;
import no.ccat.model.Definition;
import no.dcat.shared.Publisher;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Reader;
import java.net.URL;
import java.util.*;

/*
    Transform RDF/Turtle into our domain model (ConceptDenormalized and friends)
*/
@Service
public class RDFToModelTransformer {

    public static final String defaultLanguage = "nb";
    private static final Logger logger = LoggerFactory.getLogger(RDFToModelTransformer.class);
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
        List<Resource> betydningsbeskivelses = getNamedSubPropertiesAsListOfResources(resource, SKOSNO.betydningsbeskrivelse);
        for (Resource betydningsbeskrivelse : betydningsbeskivelses) {
            //We may need to merge the different language strings from the different betydningsbeskrivelses
            Map<String, String> newLanguageLiteral = extractLanguageLiteral(betydningsbeskrivelse, RDFS.label);
            definition.getText().putAll(newLanguageLiteral);
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

        String uri = conceptResource.getURI();

        List<ConceptDenormalized> existingConcepts = conceptDenormalizedRepository.findByUri(uri);
        if (existingConcepts.size() > 1) {
            logger.warn("Found multiple concepts for uri " + uri + ", expected 0 or 1 ");
        }
        String id = existingConcepts.size() > 0 ? existingConcepts.get(0).getId() : UUID.randomUUID().toString();

        concept.setId(id);

        concept.setUri(uri);

        concept.setPublisher(extractPublisher(conceptResource, DCTerms.publisher));

        concept.setSubject(extractLanguageLiteral(conceptResource, DCTerms.subject));

        concept.setPrefLabel(extractLanguageLiteralFromLabel(conceptResource, SKOSXL.prefLabel));

        concept.setHiddenLabel(extractLanguageLiteralFromListOfLabels(conceptResource, SKOSXL.hiddenLabel));

        concept.setAltLabel(extractLanguageLiteralFromListOfLabels(conceptResource, SKOSXL.altLabel));

        concept.setDefinition(extractDefinition(conceptResource));

        return concept;
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
