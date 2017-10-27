package no.dcat.harvester;

import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.SimpleSelector;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SubjectCrawler {
    private static Logger logger = LoggerFactory.getLogger(SubjectCrawler.class);

    private Model model;

    public Model crawlSubjects(Model inputModel) {
        model = inputModel;

        StmtIterator statementIterator = model.listStatements(new SimpleSelector(null, DCTerms.subject, (RDFNode) null));
        while(statementIterator.hasNext()) {
            Statement statement = statementIterator.nextStatement();

            Subject subject = AbstractBuilder.extractSubject(statement);

            if (subject.getDefinition() == null) {

            }

            logger.info(subject.getUri());

        }


        return model;
    }
}
