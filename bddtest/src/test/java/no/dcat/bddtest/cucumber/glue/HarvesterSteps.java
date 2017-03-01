package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.is.En;
import no.dcat.harvester.HarvesterApplication;
import no.dcat.harvester.crawler.web.CrawlerRestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.system.EmbeddedServerPortFileWriter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.setup.StandaloneMockMvcBuilder;

import java.util.List;

/**
 * Created by dask on 28.02.2017.
 */
public class HarvesterSteps {
    private static Logger logger = LoggerFactory.getLogger(HarvesterSteps.class);

    private MockMvc mockMvc;

    @Before
    public void setUpServer() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new CrawlerRestController()).build();
    }

    @Given("I have registered the following catalog-urls:")
    public void registerCatalogUrls(DataTable urls) {
        logger.info("Register catalog urls");

        for (List<String> url : urls.raw()) {

            logger.info("Loading {}", url);
        }
    }

    @Given("harvester starts$")
    public void harvesterStarts() {

    }

    @Given("harvester starts with scheduler set to once a minute")
    public void harvesterStartsWithSchedulerSet() {

    }

    @Then("the Urls are called$")
    public void theUrlsAreCalled() {

    }


}
