package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Glue-code common for all page-tests.
 */
public class BackgroundPage extends CommonPage {
    private final String index = "dcat";

    private final String portalHostname = "localhost"; // getEnv("fdk.hostname");
    private int portalPort = 8080; //getEnvInt("fdk.port");

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    @Given("^I clean elastic search\\.$")
    public void cleanElasticSearch() throws Throwable {
        String hostname = "localhost";
        int port = 9300;
        //String hostname = getEnv("elasticsearch.hostname");
        //int port = getEnvInt("elasticsearch.port");

        new DeleteIndex(hostname, port).deleteIndex(index);
    }

    @Given("^I load the \"([^\"]*)\" dataset\\.$")
    public void loadDataset(String filename) throws IOException {
        deleteAndLoad(filename);
    }

    @Given("^Elasticsearch kjører")
    public void elasticSearchIsRunning() {
        RestTemplate restTemplate = new RestTemplate();
        String health = restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class);
        assertThat(health, is(not(nullValue())));
    }

    @Given("^bruker datasett (.*).ttl")
    public void setupTestData(String datasett) throws IOException {
        deleteAndLoad(datasett + ".ttl");

        //String defultPath = new File(".").getCanonicalPath().toString();
        //String fileWithPath = String.format("file://%s/test/data/%s.ttl", defultPath, datasett);


    }

    private void deleteAndLoad(String datasett) throws IOException {
        String hostname = "localhost"; //getEnv("elasticsearch.hostname");
        int port = 9300; //getEnvInt("elasticsearch.port");

        new DeleteIndex(hostname, port).deleteIndex(index);
        Loader loader = new Loader(hostname, port);
        try {
            loader.harvestAllCodes(true);

            Thread.sleep(3000);

            Resource resource = new ClassPathResource(datasett);

            loader.loadDatasetFromFile(resource.getURL().toString());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Given("^man har åpnet Fellesdatakatalog i en nettleser")
    public void openBrowserToHomepage() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }


    protected String getPage() {
        return null;
    }
}
