package no.dcat.service;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import no.dcat.model.Catalog;
import no.dcat.shared.admin.DcatSourceDto;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;

/**
 * Created by bjg on 20.02.2018.
 */
@Category(UnitTest.class)
public class HarvesterServiceTest {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort());


    @Test
    public void getHarvestEntriesReturnsCorrectNumberOFEntries() throws Exception {

        HarvesterService hs = new HarvesterService();
        hs.harvesterUrl = "http://localhost:" + wireMockRule.port();
        hs.harvesterUsername = "testuser";
        hs.harvesterPassword = "testpasword";

        harvesterResponseGetDcatSourcesWireMockStub();

        List<DcatSourceDto> result = hs.getHarvestEntries();
        assertTrue(result.size() == 2);

    }


    @Test
    public void harvestEntryContainsCorrectUri() throws Exception {

        HarvesterService hs = new HarvesterService();
        hs.harvesterUrl = "http://localhost:" + wireMockRule.port();
        hs.harvesterUsername = "testuser";
        hs.harvesterPassword = "testpasword";

        harvesterResponseGetDcatSourcesWireMockStub();

        List<DcatSourceDto> result = hs.getHarvestEntries();
        assertEquals(result.get(1).getUrl(), "http://test.test.no");

    }


    @Test
    public void createHarvestEntryWorks() throws Exception {

        HarvesterService hs = new HarvesterService();
        hs.harvesterUrl = "http://localhost:" + wireMockRule.port();
        hs.harvesterUsername = "testuser";
        hs.harvesterPassword = "testpasword";

        harvesterResponsePostDcatSourceWireMockStub();

        Catalog catalog = new Catalog();
        catalog.setId("123455");
        catalog.setUri("http://brreg.no/43434343434");
        Map<String, String> title = new HashMap<>();
        title.put("nb", "Description");
        catalog.setTitle(title);

        boolean success = hs.createHarvestEntry(catalog, "http://harvest.here.no");
        assertTrue(success);

    }


    /**
     * Simulate response from harvester
     */
    private void harvesterResponseGetDcatSourcesWireMockStub() {
        stubFor(get(urlEqualTo("/api/admin/dcat-sources"))
            .withHeader("Accept", containing("application/json"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("[\n" +
                    "    {\n" +
                    "        \"id\": \"http://dcat.difi.no/dcatSource_91413042-6549-4e11-8821-686f35954301\",\n" +
                    "        \"description\": \"Datakatalog for REINLI OG BERLEVÅG REGNSKAP\",\n" +
                    "        \"user\": \"test_admin\",\n" +
                    "        \"orgnumber\": \"910888447\",\n" +
                    "        \"url\": \"https://localhost:8099/catalogs/910888447\"\n" +
                    "    },\n" +
                    "    {\n" +
                    "        \"id\": \"http://dcat.difi.no/dcatSource_e64c0b66-162a-4c5a-8ed0-01260d397d8c\",\n" +
                    "        \"description\": \"Datakatalog for Testformål\",\n" +
                    "        \"user\": \"test_admin\",\n" +
                    "        \"orgnumber\": \"787867677\",\n" +
                    "        \"url\": \"http://test.test.no\"\n" +
                    "    }\n" +
                    "]")));

    }


    /**
     * Simulate response from harvester
     */
    private void harvesterResponsePostDcatSourceWireMockStub() {
        stubFor(post(urlEqualTo("/api/admin/dcat-source"))
            .willReturn(aResponse()
                .withStatus(202)));

    }
}
