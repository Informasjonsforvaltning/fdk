package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;
import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by bjg on 03.11.2017.
 */
public class PortalSteps extends CommonPage {
    private static Logger logger = LoggerFactory.getLogger(HarvestSteps.class);

    public static String PORTAL_URL = "http://localhost:8080";

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    @Then("^the following dataset detail pages shall exist in search portal:$")
    public void norwegianProperties(DataTable datasets) throws Throwable {


        for (List<String> dataset : datasets.raw()) {
            String dsId = dataset.get(0);
            logger.info("Test dataset {}", dsId);

            openPage(PORTAL_URL + "/datasets/" + URLEncoder.encode(dsId,"utf-8"));

            assertTrue("Detail page has title ", driver.getTitle() != null);
        }

    }

}
