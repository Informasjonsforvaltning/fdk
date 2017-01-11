package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.Given;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;
import org.springframework.web.client.RestTemplate;

import java.io.File;

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Glue-code common for al page-tests.
 */
public class BackgroundPage extends CommonPage {
    private final String index = "dcat";

    private final String portalHostname = "localhost"; // getEnv("fdk.hostname");
    private int portalPort = 8080; //getEnvInt("fdk.port");

    @Given("^I clean elastic search\\.$")
    public void cleanElasticSearch() throws Throwable {
        String hostname = "localhost";
        int port = 9300;
        //String hostname = getEnv("elasticsearch.hostname");
        //int port = getEnvInt("elasticsearch.port");

        //new DeleteIndex(hostname, port).deleteIndex(index);
    }

    @Given("^I load the \"([^\"]*)\" dataset\\.$")
    public void loadDataset(String filename) throws Throwable {
        String hostname = "localhost"; //getEnv("elasticsearch.hostname");
        int port = 9300; //getEnvInt("elasticsearch.port");

        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/bddtest/src/test/resources/%s", defultPath, filename);

        new Loader(hostname, port).loadDatasetFromFile(fileWithPath);
    }

    @Given("^Elasticsearch kjører")
    public void elasticSearchIsRunning() {
        RestTemplate restTemplate = new RestTemplate();
        String health = restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class);
        assertThat(health, is(not(nullValue())));
    }

    @Given("^bruker datasett dataset-test.ttl")
    public void setupTestData() {
        //TODO
    }

    @Given("^man har åpnet Fellesdatakatalog i en nettleser")
    public void openBrowserToHomepage() {
        openBrowser();
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }


    protected String getPage() {
        return null;
    }
}
