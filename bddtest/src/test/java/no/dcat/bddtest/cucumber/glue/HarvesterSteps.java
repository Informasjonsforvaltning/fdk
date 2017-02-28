package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by dask on 28.02.2017.
 */
public class HarvesterSteps {
    private static Logger logger = LoggerFactory.getLogger(HarvesterSteps.class);

    @Given("I have registered the following catalog-urls:")
    public void registerCatalogUrls(DataTable urls) {
        logger.info("Register catalog urls");

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
