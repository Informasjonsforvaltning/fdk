package no.dcat.harvester.service;

import no.dcat.shared.SkosConcept;
import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.RDFNode;
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

    private final ReferenceDataSubjectService referenceDataService;

    @Autowired
    public SubjectCrawler(ReferenceDataSubjectService referenceDataSubjectService) {
        this.referenceDataService = referenceDataSubjectService;
    }

    public SubjectCrawler() {
        this.referenceDataService = new ReferenceDataSubjectService();
    }


    private Model model;

    public Model crawlSubjects(Model inputModel) {
        model = inputModel;

        Map<String, Subject> foundSubjects = new HashMap<>();
        Set<String> excludedSubjects = new HashSet<>();

        StmtIterator statementIterator = model.listStatements(new SimpleSelector(null, DCTerms.subject, (RDFNode) null));
        while(statementIterator.hasNext()) {
            Statement statement = statementIterator.nextStatement();

            Subject subject = AbstractBuilder.extractSubject(statement);
            if (subject != null && subject.getUri() != null) {

                Subject harvestedSubject = null;
                try {
                    harvestedSubject = referenceDataService.getSubject(subject.getUri());

                    if (harvestedSubject != null) {
                        foundSubjects.put(subject.getUri(), harvestedSubject);

                        logger.info("found subject: {}", harvestedSubject);
                    }
                } catch (Exception e) {
                    excludedSubjects.add(subject.getUri());
                     logger.warn("did not find subject: {}", subject.getUri());
                }
            }



        }


        return model;
    }
}
