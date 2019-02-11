package no.dcat.datastore.domain.dcat;

import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.shared.Subject;
import no.fdk.test.testcategories.IntegrationTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

@Category(IntegrationTest.class)
public class SubjectsFromGithubIT {
    private static Logger logger = LoggerFactory.getLogger(SubjectsFromGithubIT.class);


    @Test
    public void testDataFromGithub() throws IOException {

        checkSubject("https://data-david.github.io/Begrep/begrep/Organisasjonsnummer", "organisasjonsnummer");
        checkSubject("https://data-david.github.io/Begrep/begrep/Enhet", "enhet");
        checkSubject("https://data-david.github.io/Begrep/begrep/Hovedenhet", "hovedenhet");
        checkSubject("https://data-david.github.io/Begrep/begrep/Foretaksnavn", "Foretaksnavn");
        checkSubject("https://data-david.github.io/Begrep/begrep/Underenhet", "underenhet");
    }

    private void checkSubject(String uri, String prefLabel) throws MalformedURLException {

        logger.debug("lookup uri: {}", uri);
        Model model = ModelFactory.createDefaultModel();
        model.read(uri, null, "TURTLE");

        Subject subject = null;

        ResIterator resIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);
        while (resIterator.hasNext()) {
            Resource r = resIterator.next();

            subject = DatasetBuilder.extractSubject(r);
        }

        assertThat(subject, is(notNullValue()));

        assertEquals(prefLabel, subject.getPrefLabel().get("no"));

        logger.debug(subject.toString());
    }
}
