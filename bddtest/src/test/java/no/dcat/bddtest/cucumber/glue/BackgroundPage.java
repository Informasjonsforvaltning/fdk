package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.Given;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;

import java.io.File;

/**
 * Glue-code common for al page-tests.
 */
public class BackgroundPage extends CommonPage {
    private final String index = "dcat";

    @Given("^I clean elastic search\\.$")
    public void cleanElasticSearch() throws Throwable {
        String hostname = getEnv("elasticsearch.hostname");
        int port = getEnvInt("elasticsearch.port");

        new DeleteIndex(hostname, port).deleteIndex(index);
    }

    @Given("^I load the \"([^\"]*)\" dataset\\.$")
    public void i_load_the_dataset(String filename) throws Throwable {
        String hostname = getEnv("elasticsearch.hostname");
        int port = getEnvInt("elasticsearch.port");

        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/src/test/resources/%s", defultPath, filename);

        new Loader(hostname, port).loadDatasetFromFile(fileWithPath);
    }

    protected String getPage() {
        return null;
    }
}
