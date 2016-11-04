package no.dcat.harvester.dcat.domain.theme.builders;

import no.dcat.harvester.dcat.domain.theme.DataTheme;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test class for DataThemeBuilders
 */
public class DataThemeBuildersTest {
    @Test
    public void testDataThemeBuilders() {
        final Model model = ModelFactory.createDefaultModel();
        model.read("file:/development/fdk/harvester/src/test/resources/test-data-theme-skos.rdf");

        List<DataTheme> dataThemes = new DataThemeBuilders(model).build();

        assertEquals("15 records shall have been created.",15,dataThemes.size());
        assertEquals("Check id on first record.","http://publications.europa.eu/resource/authority/data-theme/TRAN",dataThemes.get(0).getId());
        assertEquals("Check code on first record.","TRAN",dataThemes.get(0).getCode());
        assertEquals("Check startuse on first record.","2015-10-01",dataThemes.get(0).getStartUse());
        assertEquals("Check norwegian titel on first record.","Transport",dataThemes.get(0).getTitle().get("nb"));
        assertEquals("Check english titel on first record.","Transport",dataThemes.get(0).getTitle().get("en"));
        assertEquals("Check conceptschema id on first record.","http://publications.europa.eu/resource/authority/data-theme",dataThemes.get(0).getConceptSchema().getId());
        assertEquals("Check conceptschema titel on first record.","Dataset types Named Authority List",dataThemes.get(0).getConceptSchema().getTitle());
        assertEquals("Check conceptschema versioninfo on first record.","20160921-0",dataThemes.get(0).getConceptSchema().getVersioninfo());
        assertEquals("Check conceptschema versionnumber on first record.","20160921-0",dataThemes.get(0).getConceptSchema().getVersionnumber());
    }
}
