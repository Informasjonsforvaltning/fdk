package no.dcat.harvester.service;

import no.dcat.shared.Subject;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.SimpleSelector;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class SubjectCrawler {
    private static Logger logger = LoggerFactory.getLogger(SubjectCrawler.class);
    private final DcatBuilder builder = new DcatBuilder();

    /**
     * Runs through all subject predicates in the model.
     *
     * Attempts to look up the concept of the subject via the reference-data service. If success the prefLabel, definition,
     * note and source is added to the model. Otherwise the model is not touched.
     *
     * @param model the model to iterate over and check for subjects
     * @return the model which has been annotated with subject definitions
     */
    public Model annotateSubjects(Model model) {

        Map<String, Subject> foundSubjects = new HashMap<>();
        Set<String> excludedSubjects = new HashSet<>();

        StmtIterator statementIterator = model.listStatements(new SimpleSelector(null, DCTerms.subject, (RDFNode) null));
        while(statementIterator.hasNext()) {
            Statement statement = statementIterator.nextStatement();

            Subject subjectInModel = DatasetBuilder.extractSubject(statement.getObject().asResource());
            if (subjectInModel != null && subjectInModel.getUri() != null && !foundSubjects.containsKey(subjectInModel.getUri())) {
                Resource subjectResource = statement.getObject().asResource();

                try {
                    for (Subject harvestedSubject : loadSubjects(subjectInModel.getUri())) {

                        if (harvestedSubject != null && harvestedSubject.getUri() != null) {
                            foundSubjects.put(harvestedSubject.getUri(), harvestedSubject);

                            logger.info("found subject: {}", harvestedSubject);

                            if (harvestedSubject.getUri().equals(subjectInModel.getUri())) {
                                removeDuplicatedProperties(harvestedSubject, subjectResource);
                            } else {
                                subjectResource = model.createResource(harvestedSubject.getUri());
                            }

                            builder.addSubjectContent(harvestedSubject, subjectResource);
                        }
                    }
                } catch (Exception e) {
                    excludedSubjects.add(subjectInModel.getUri());
                }
            }
        }

        logger.info("Successfully looked up {} subjects. {} subjects did not resolve.", foundSubjects.size(), excludedSubjects.size());
        excludedSubjects.forEach(key -> {
            logger.warn("Unable to lookup subject wiht uri: <{}>", key);
        });


        return model;
    }

    public void removeDuplicatedProperties(Subject subject, Resource resource) {

        removeProperty(subject.getPrefLabel(), resource, SKOS.prefLabel);
        removePropertyList(subject.getAltLabel(), resource, SKOS.altLabel);
        removeProperty(subject.getDefinition(), resource, SKOS.definition);
        removeProperty(subject.getNote(), resource, SKOS.note);
        // TODO more attributes? source, date...
    }

    private void removePropertyList(List<Map<String,String>> labels, Resource resource, Property property){
        Statement stmnt = resource.getProperty(property);
        if (stmnt != null && labels != null && !labels.isEmpty()) {
            labels.forEach( label -> {
                removeProperty(label, resource, property);
            });
        }
    }

    private void removeProperty(Map<String,String> label, Resource resource, Property property) {
        Statement stmnt = resource.getProperty(property);
        if (stmnt != null && label != null) {
            if (stmnt.getObject().isLiteral() && !label.isEmpty()) {
                resource.removeAll(property);
            }
        }
    }


    public List<Subject> loadSubjects(String uri) {
            // load model
            try {
                Model model = loadModel(uri);

                if (model == null) {
                    return null;
                }

                List<Subject> result = new ArrayList<>();
                ResIterator subjectIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);
                while (subjectIterator.hasNext()) {
                    Resource r = subjectIterator.nextResource();
                    Subject s = DatasetBuilder.extractSubject(r);
                    result.add(s);
                }

                return result;

            } catch (Exception e) {
                logger.warn("Subject could not be read. Reason {}", e.getLocalizedMessage());
            }

        return null;
    }

    public Model loadModel(String URLName){
        Exception jenaException = null;
        Model model;
        try {
            model = FileManager.get().loadModel(URLName, "TURTLE");
            return model;
        }
        catch (Exception e) {
            jenaException = e;
        }

        try {
            model = FileManager.get().loadModel(URLName, "RDFXML");
            return model;
        }
        catch (Exception e) {
            jenaException = e;
        }

        try {
            model = FileManager.get().loadModel(URLName, "JSONLD");
            return model;
        }
        catch (Exception e) {
            jenaException = e;

        }

        logger.warn("URI {} could not be resolved. Have tried all TURTLE, RDFXML and JSONLD. Last exception {}", URLName, jenaException.getLocalizedMessage());

        return null;
    }
}
