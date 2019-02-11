package no.dcat.themes.builders;

import no.dcat.shared.DataTheme;
import no.fdk.test.testcategories.UnitTest;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.ThemesService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test class for DataThemeBuilders
 */
@Category(UnitTest.class)
public class DataThemeBuildersTest {

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();


    @Test
    public void testDataThemeBuilders() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();
        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        List<DataTheme> dataThemes = new ThemesService(tdbConnection).getThemes();


        assertEquals("13 records shall have been created.", 13, dataThemes.size());

        DataTheme transport = dataThemes.stream().filter(theme -> theme.getId().equals("http://publications.europa.eu/resource/authority/data-theme/TRAN")).findAny().get();

        assertEquals("Check code", "TRAN", transport.getCode());
        assertEquals("Check startuse", "2015-10-01", transport.getStartUse());
        assertEquals("Check norwegian titel", "Transport", transport.getTitle().get("nb"));
        assertEquals("Check english titel", "Transport", transport.getTitle().get("en"));
        assertEquals("Check conceptschema id", "http://publications.europa.eu/resource/authority/data-theme", transport.getConceptSchema().getId());
        assertEquals("Check conceptschema titel", "Dataset types Named Authority List", transport.getConceptSchema().getTitle().get("en"));
        assertEquals("Check conceptschema versioninfo", "20160921-0", transport.getConceptSchema().getVersioninfo());
        assertEquals("Check conceptschema versionnumber", "20160921-0", transport.getConceptSchema().getVersionnumber());
    }
}
