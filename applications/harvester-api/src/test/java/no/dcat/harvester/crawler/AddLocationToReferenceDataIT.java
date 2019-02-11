package no.dcat.harvester.crawler;

import no.dcat.datastore.domain.dcat.client.BasicAuthRestTemplate;
import no.dcat.datastore.domain.dcat.client.LoadLocations;
import no.dcat.shared.SkosCode;
import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest
@Category(IntegrationTest.class)
@Ignore
public class AddLocationToReferenceDataIT {

    @Value("${application.referenceDataUrl}")
    private String referenceDataUrl;

    @Value("${application.httpUsername}")
    private String httpUsername;

    @Value("${application.httpPassword}")
    private String httpPassword;

    private LoadLocations loadLocations;
    private BasicAuthRestTemplate template;

    @Before
    public void setup() {
        loadLocations = new LoadLocations(referenceDataUrl, httpUsername, httpPassword);
        template = new BasicAuthRestTemplate(httpUsername, httpPassword);
    }

    @Test
    public void loadALocationOK() {

        String aalesundKommuneUri = "http://data.geonorge.no/administrativeEnheter/kommune/id/172758";

        loadLocations.postLocationToReferenceData(template, aalesundKommuneUri);

        SkosCode location = loadLocations.getLocation(aalesundKommuneUri);

        assertThat(location, is(notNullValue()));
        assertThat(location.getPrefLabel().get("no"), is("Ålesund"));
    }

}
