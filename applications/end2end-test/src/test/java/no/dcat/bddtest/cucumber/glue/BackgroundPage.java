package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;

import no.dcat.bddtest.cucumber.model.ThemeCountSmall;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import no.dcat.harvester.crawler.Loader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.concurrent.Callable;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Glue-code common for all page-tests.
 */
public class BackgroundPage extends CommonPage {
  private static Logger logger = LoggerFactory.getLogger(BackgroundPage.class);
  private final String index = "dcat";

  private final String portalHostname = "localhost";
  private int portalPort = 8080;

  @Before
  public void setup() {
    setupDriver();
  }

  @After
  public void shutdown() {
    stopDriver();
  }

  @Given("^I start with empty elasticsearch index\\.$")
  public void cleanElasticSearch() throws Throwable {
        String hosts = "localhost:9300";

        new DeleteIndex(hosts).deleteIndex(index);
  }


  @Given("^I load the \"([^\"]*)\" dataset\\.$")
    public void loadDataset(String filename) throws IOException {
    deleteAndLoad(filename);
  }


  @Given("^Elasticsearch is running")
  public void elasticSearchIsRunning() {
    RestTemplate restTemplate = new RestTemplate();
        String health = restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class);
    assertThat(health, is(not(nullValue())));
  }


  @Given("^uses dataset (.*).ttl")
    public void setupTestData(String datasett) throws IOException {

    logger.info("setupTestData(datasett: '{}')", datasett);

        Callable<Boolean> waitFor = () -> {
          int total = getThemeCount();
          logger.info("total: {}", total);
          return total == 92;

        };

    deleteLoadAndWait(datasett + ".ttl", waitFor);

  }


  @Given("^Search portal is open in web browser")
  public void openBrowserToHomepage() {
    driver.get("http://" + portalHostname + ":" + portalPort + "/");
  }


  private int getThemeCount() {
    RestTemplate restTemplate1 = new RestTemplate();
    try {
            return restTemplate1.getForObject("http://localhost:8083/themecount", ThemeCountSmall.class).getHits().getTotal();
    } catch (Exception e) {
      return 0;
    }
  }


    private void deleteLoadAndWait(String dataset, Callable<Boolean> waitFor) throws IOException {
    deleteAndLoad(dataset);
    await().atMost(30, SECONDS).until(waitFor);
  }


    private void deleteAndLoad(String datasett) throws IOException {

        String hosts = "localhost:9300";

        new DeleteIndex(hosts).deleteIndex(index);

        Loader loader = new Loader(hosts, "elasticsearch", "http://localhost:8100", "user", "password");

    waitForHarvesterToComplete();

    Resource resource = new ClassPathResource(datasett);

    loader.loadDatasetFromFile(resource.getURL().toString());
    waitForHarvesterToComplete();

        refreshElasticsearch(hosts, "elasticsearch");
  }

}
