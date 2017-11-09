package no.dcat.harvester.service;

import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.SimpleSelector;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class SubjectCrawler {
    private static Logger logger = LoggerFactory.getLogger(SubjectCrawler.class);
    private final DcatBuilder builder = new DcatBuilder();

    private final ReferenceDataSubjectService referenceDataService;

    @Autowired
    public SubjectCrawler(ReferenceDataSubjectService referenceDataSubjectService) {
        this.referenceDataService = referenceDataSubjectService;
    }


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

            Subject subjectInModel = DatasetBuilder.extractSubject(statement);
            if (subjectInModel != null && subjectInModel.getUri() != null && !foundSubjects.containsKey(subjectInModel.getUri())) {
                Resource subjectResource = statement.getObject().asResource();

                Subject harvestedSubject = null;
                try {
                    harvestedSubject = referenceDataService.getSubject(subjectInModel.getUri());

                    if (harvestedSubject != null) {
                        foundSubjects.put(subjectInModel.getUri(), harvestedSubject);

                        logger.info("found subject: {}", harvestedSubject);
                        builder.addSubjectContent(harvestedSubject, subjectResource);
                        // TODO delete existing prefLabel, definition, note and source?!

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
}
