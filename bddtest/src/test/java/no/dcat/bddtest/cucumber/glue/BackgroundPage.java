package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.Given;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;

import java.io.File;
import java.io.IOException;

/**
 * Glue-code common for all page-tests.
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
    public void loadDataset(String filename) throws IOException {
        String hostname = "localhost"; //getEnv("elasticsearch.hostname");
        int port = 9300; //getEnvInt("elasticsearch.port");
        new DeleteIndex(hostname, port).deleteIndex(index);
        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/src/test/resources/%s", defultPath, filename);

        new Loader(hostname, port).loadDatasetFromFile(fileWithPath);

    }

    @Given("^Elasticsearch kjører")
    public void elasticSearchIsRunning() {
        RestTemplate restTemplate = new RestTemplate();
        String health = restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class);
        assertThat(health, is(not(nullValue())));
    }

    @Given("^bruker datasett (.*).ttl")
    public void setupTestData(String datasett) throws IOException {
        String hostname = "localhost"; //getEnv("elasticsearch.hostname");
        int port = 9300; //getEnvInt("elasticsearch.port");

        new DeleteIndex(hostname, port).deleteIndex(index);

        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/test/data/%s.ttl", defultPath, datasett);

        new Loader(hostname, port).loadDatasetFromFile(fileWithPath);
    }

    @Given("^man har åpnet Fellesdatakatalog i en nettleser")
    public void openBrowserToHomepage() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }


    protected String getPage() {
        return null;
    }
}
