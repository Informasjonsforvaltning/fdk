package no.dcat.themes.builders;

import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.dcat.themes.database.TDBConnection;
import no.dcat.themes.database.TDBService;
import no.dcat.themes.service.CodesService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

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

        TDBConnection tdbConnection = new TDBConnection(tdbService);


        SkosCode code = new CodesService(tdbConnection).addLocation("http://sws.geonames.org/3144096/");

        System.out.println(code.toString());
    }


}