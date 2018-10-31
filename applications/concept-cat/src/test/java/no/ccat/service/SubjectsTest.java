package no.ccat.service;

import no.dcat.shared.Subject;
import no.dcat.shared.testcategories.UnitTest;
import no.ccat.database.TDBConnection;
import no.ccat.database.TDBInferenceService;
import no.ccat.database.TDBService;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.net.MalformedURLException;

/**
 * Test class for SubjectsService
 */
@Category(UnitTest.class)
public class SubjectsTest {
    private static Logger logger = LoggerFactory.getLogger(SubjectsTest.class);

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    @Test
    public void testDataFromGithub() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        checkSubject(tdbConnection, "https://data-david.github.io/Begrep/begrep/Enhet", "enhet");
        checkSubject(tdbConnection, "https://data-david.github.io/Begrep/begrep/Organisasjonsnummer", "organisasjonsnummer");
        checkSubject(tdbConnection, "https://data-david.github.io/Begrep/begrep/Hovedenhet", "hovedenhet");
        checkSubject(tdbConnection, "https://data-david.github.io/Begrep/begrep/Foretaksnavn", "Foretaksnavn");
        checkSubject(tdbConnection, "https://data-david.github.io/Begrep/begrep/Underenhet", "underenhet");
    }


    @Test(expected = MalformedURLException.class)
    public void testLocalAccessDoesNotWork() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        checkSubject(tdbConnection, "file:///Users/havardottestad/Documents/BRREG/felles-datakatalog/applications/reference-data/src/main/resources/rdf/data-theme-skos.rdf", "hovedenhet");

    }

    private void checkSubject(no.ccat.database.TDBConnection tdbConnection, String uri, String prefLabel) throws MalformedURLException {
        logger.debug("lookup uri: {}", uri);
        Subject subject = new SubjectsService(tdbConnection).addSubject(uri);

        Assert.assertThat(subject, Matchers.is(Matchers.notNullValue()));
        Assert.assertEquals(prefLabel, subject.getPrefLabel().get("no"));

        logger.debug(subject.toString());
    }

}
