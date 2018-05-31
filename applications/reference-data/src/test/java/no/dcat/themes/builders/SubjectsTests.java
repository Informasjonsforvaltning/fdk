package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.Subject;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.SubjectsService;
import org.apache.jena.vocabulary.SKOS;
import org.hamcrest.Matchers;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

/**
 * Test class for CodeBuildersTest
 */
@Category(UnitTest.class)
public class SubjectsTests {
    private static Logger logger = LoggerFactory.getLogger(SubjectsTests.class);

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    @Test
    public void testDataFromGithub() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();

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
        tdbService.postConstruct();

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        checkSubject(tdbConnection, "file:///Users/havardottestad/Documents/BRREG/felles-datakatalog/applications/reference-data/src/main/resources/rdf/data-theme-skos.rdf", "hovedenhet");

    }

    private void checkSubject(TDBConnection tdbConnection, String uri, String prefLabel) throws MalformedURLException {
        logger.debug("lookup uri: {}", uri);
        Subject subject = new SubjectsService(tdbConnection).addSubject(uri);

        assertThat(subject, Matchers.is(Matchers.notNullValue()));
        assertEquals(prefLabel, subject.getPrefLabel().get("no"));

        logger.debug(subject.toString());
    }

}