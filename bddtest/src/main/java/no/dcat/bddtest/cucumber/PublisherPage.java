package no.dcat.bddtest.cucumber;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;
import org.apache.commons.lang3.StringUtils;

/**
 * Cucumber glue class for the publisher feature.
 */
public class PublisherPage {
    private final String index = "dcat";
    private final String filename = "file://";

    @Given("^I clean elastic search\\.$")
    public void cleanElasticSearch() throws Throwable {
        String hostname = getEnv("elasticsearch.hostname");
        int port = getEnvInt("elasticsearch.port");

        new DeleteIndex(hostname, port).deleteIndex(index);
    }

    @Given("^I load the dataset\\.$")
    public void iLoadDataset() throws Throwable {
        String hostname = getEnv("elasticsearch.hostname");
        int port = getEnvInt("elasticsearch.port");

        new Loader(hostname, port).loadDatasetFromFile(filename);
    }

    @Given("^I open the Publisher page in the browser\\.$")
    public void i_open_the_Publisher_page_in_the_browser() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
    }

    @Then("^ shall have $")
    public void shall_have() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
    }

    private String getEnv(String env) {
        String value = System.getenv(env);

        if (StringUtils.isEmpty(value)) {
            throw new RuntimeException(String.format("Environment %s variable is not defines.", env));
        }

        return value;
    }

    private int getEnvInt(String env) {
        return Integer.valueOf(getEnv(env));
    }
}
