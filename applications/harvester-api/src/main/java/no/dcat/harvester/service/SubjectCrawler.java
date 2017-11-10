package no.dcat.harvester.service;

import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.apache.http.HttpResponse;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

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

            Subject subjectInModel = DatasetBuilder.extractSubject(statement.getResource().asResource());
            if (subjectInModel != null && subjectInModel.getUri() != null && !foundSubjects.containsKey(subjectInModel.getUri())) {
                Resource subjectResource = statement.getObject().asResource();

                try {
                    for (Subject harvestedSubject : loadSubjects(subjectInModel.getUri())) {

                        if (harvestedSubject != null) {
                            foundSubjects.put(harvestedSubject.getUri(), harvestedSubject);

                            logger.info("found subject: {}", harvestedSubject);
                            model.createResource(harvestedSubject.getUri());
                            builder.addSubjectContent(harvestedSubject, subjectResource);
                            // TODO delete existing prefLabel, definition, note and source?!
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

    public List<Subject> loadSubjects(String uri) {
        // check if uri resolves HEAD

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
                logger.warn("Subject {} could not be read. Reason {}", e.getLocalizedMessage());
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
