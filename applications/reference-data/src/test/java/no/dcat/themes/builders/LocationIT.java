package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBInferenceService;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.CodesService;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;

import static org.junit.Assert.assertEquals;

/**
 * Test class for CodeBuildersTest
 */
public class LocationIT {

    @Rule
    public TemporaryFolder testFolder = new TemporaryFolder();

    CodesService codesService;


    @Before
    public void setup() throws IOException {
        TDBService tdbService = new TDBService(testFolder.getRoot().getCanonicalPath());
        tdbService.postConstruct();

        TDBInferenceService tdbInferenceService = new TDBInferenceService(tdbService);
        TDBConnection tdbConnection = new TDBConnection(tdbInferenceService);

        codesService = new CodesService(tdbConnection);
    }

    @Test
    public void testNorwayFromGeonames() throws IOException {
        SkosCode code = codesService.addLocation("http://sws.geonames.org/3144096/");

        assertEquals("Norge", code.getPrefLabel().get("no"));
    }

    @Test
    public void testOsloFromGeonames2() throws IOException {

        SkosCode code = codesService.addLocation("http://sws.geonames.org/3143242/");

        assertEquals("Oslo", code.getPrefLabel().get("no"));
    }

    @Test
    public void testGeonorgeFylke() throws IOException {
        SkosCode code = codesService.addLocation("http://data.geonorge.no/administrativeEnheter/fylke/id/173150");

        assertEquals("Sogn og Fjordane", code.getPrefLabel().get("no"));
    }

    @Test
    public void testGeonorgeKommune() throws IOException {
        SkosCode code = codesService.addLocation("http://data.geonorge.no/administrativeEnheter/kommune/id/172778");

        assertEquals("Bergen", code.getPrefLabel().get("no"));
    }

    @Test
    @Ignore // syntax error
    public void testGeonorgeNasjon() throws IOException {
        SkosCode code = codesService.addLocation("http://data.geonorge.no/administrativeEnheter/nasjon/id/173163");

        assertEquals("Norge", code.getPrefLabel().get("no"));
    }



}