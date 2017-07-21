package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.themes.ThemesService;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test class for DataThemeBuilders
 */
public class DataThemeBuildersTest {

    public static final int NR_OF_THEMES = 13;

    @Test
    public void testDataThemeBuilders() {
        List<DataTheme> dataThemes = new ThemesService().getThemes();


        assertEquals("13 records shall have been created.", NR_OF_THEMES, dataThemes.size());

        DataTheme transport = dataThemes.stream().filter(theme -> theme.getId().equals("http://publications.europa.eu/resource/authority/data-theme/TRAN")).findAny().get();

        assertEquals("Check code", "TRAN", transport.getCode());
        assertEquals("Check startuse", "2015-10-01", transport.getStartUse());
        assertEquals("Check norwegian titel", "Transport", transport.getTitle().get("nb"));
        assertEquals("Check english titel", "Transport", transport.getTitle().get("en"));
        assertEquals("Check conceptschema id", "http://publications.europa.eu/resource/authority/data-theme", transport.getConceptSchema().getId());
        assertEquals("Check conceptschema titel", "Dataset types Named Authority List", transport.getConceptSchema().getTitle());
        assertEquals("Check conceptschema versioninfo", "20160921-0", transport.getConceptSchema().getVersioninfo());
        assertEquals("Check conceptschema versionnumber", "20160921-0", transport.getConceptSchema().getVersionnumber());
    }
}
