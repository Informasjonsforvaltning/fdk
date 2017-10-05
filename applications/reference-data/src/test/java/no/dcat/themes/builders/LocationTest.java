package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.CodesService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Test class for CodeBuildersTest
 */
public class LocationTest {

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    @Test
    public void testNorwayFromGeonames() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);


        CodesService codesService = new CodesService(tdbConnection);
        SkosCode code = codesService.addLocation("http://sws.geonames.org/3144096/");

        System.out.println(code.toString());

        assertEquals("Norge", code.getPrefLabel().get("no"));

        List<SkosCode> locations = codesService.getCodes(Types.location);
        assertTrue(locations.size() == 1);

        List<SkosCode> subjects = codesService.getCodes(Types.subject);
        assertTrue(subjects.size() == 0);


    }


}