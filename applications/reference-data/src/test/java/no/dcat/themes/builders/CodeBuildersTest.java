package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.CodesService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test class for CodeBuildersTest
 */
@Category(UnitTest.class)
public class CodeBuildersTest {

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    @Test
    public void testModel() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();
        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);


        List<SkosCode> codes = new CodesService(tdbConnection).getCodes(Types.provenancestatement);

        SkosCode vedtak = codes.stream().filter(code -> code.getUri().equals("http://data.brreg.no/datakatalog/provinens/vedtak")).findAny().get();

        assertEquals("Governmental decisions", vedtak.getPrefLabel().get("en"));
        assertEquals("Vedtak", vedtak.getPrefLabel().get("nb"));
        assertEquals("Vedtak", vedtak.getPrefLabel().get("nn"));

        SkosCode bruker = codes.stream().filter(code -> code.getUri().equals("http://data.brreg.no/datakatalog/provinens/bruker")).findAny().get();

        assertEquals("User collection", bruker.getPrefLabel().get("en"));
        assertEquals("Brukerinnsamlede data", bruker.getPrefLabel().get("nb"));
        assertEquals("Brukerinnsamlede data", bruker.getPrefLabel().get("nn"));
    }


}
