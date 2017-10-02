package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.SubjectsService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;
import java.net.MalformedURLException;

import static org.junit.Assert.assertEquals;

/**
 * Test class for CodeBuildersTest
 */
public class SubjectsTests {

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    @Test
    public void testDataFromGithub() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

//        checkSkosCode(tdbConnection, "https://data-david.github.io/Begrep/begrep/Enhet", "enhet");
        checkSkosCode(tdbConnection, "https://data-david.github.io/Begrep/begrep/Hovedenhet", "hovedenhet");
//        checkSkosCode(tdbConnection, "https://data-david.github.io/Begrep/begrep/Foretaksnavn", "Foretaksnavn");
//        checkSkosCode(tdbConnection, "https://data-david.github.io/Begrep/begrep/Organisasjonsummer", "hovedenhet");
//        checkSkosCode(tdbConnection, "https://data-david.github.io/Begrep/begrep/Underenhet", "hovedenhet");

    }


    @Test(expected = MalformedURLException.class)
    public void testLocalAccessDoesNotWork() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        checkSkosCode(tdbConnection, "file:///Users/havardottestad/Documents/BRREG/felles-datakatalog/applications/reference-data/src/main/resources/rdf/data-theme-skos.rdf", "hovedenhet");

    }

    private void checkSkosCode(TDBConnection tdbConnection, String uri, String prefLabel) throws MalformedURLException {
        System.out.println(uri);
        SkosCode code = new SubjectsService(tdbConnection).addSubject(uri);

        assertEquals(prefLabel, code.getPrefLabel().get("no"));
        System.out.println(code.toString());
    }


}