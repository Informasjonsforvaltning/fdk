package no.dcat.bddtest.cucumber.glue;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import java.util.concurrent.Callable;
import no.dcat.bddtest.ElasticsearchService;
import no.dcat.bddtest.cucumber.model.ThemeCountSmall;
import no.dcat.harvester.crawler.Loader;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.client.RestTemplate;

/** Glue-code common for all page-tests. */
public class BackgroundPage extends CommonPage {
  private static Logger logger = LoggerFactory.getLogger(BackgroundPage.class);
  private final String index = "dcat";

  private final String portalHostname = "localhost";
  private int portalPort = 8080;

  private Client elasticsearchClient;

  @Autowired
  public BackgroundPage(ElasticsearchService elasticsearchService) {
    this.elasticsearchClient = elasticsearchService.getClient();
  }

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
    String hostname = "localhost";
    int port = 9300;
    DeleteIndexRequest request = new DeleteIndexRequest(index);
    this.elasticsearchClient.admin().indices().delete(request);
  }

  @Given("^I load the \"([^\"]*)\" dataset\\.$")
  public void loadDataset(String filename) throws Throwable {
    deleteAndLoad(filename);
  }

  @Given("^Elasticsearch is running")
  public void elasticSearchIsRunning() {
    RestTemplate restTemplate = new RestTemplate();
    String health =
        restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class);
    assertThat(health, is(not(nullValue())));
  }

  @Given("^uses dataset (.*).ttl")
  public void setupTestData(String datasett) throws Throwable {

    logger.info("setupTestData(datasett: '{}')", datasett);

    Callable<Boolean> waitFor =
        () -> {
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
      return restTemplate1
          .getForObject("http://localhost:8083/themecount", ThemeCountSmall.class)
          .getHits()
          .getTotal();
    } catch (Exception e) {
      return 0;
    }
  }

  private void deleteLoadAndWait(String dataset, Callable<Boolean> waitFor) throws Throwable {
    deleteAndLoad(dataset);
    await().atMost(30, SECONDS).until(waitFor);
  }

  private void deleteAndLoad(String datasett) throws Throwable {

    String hostname = "localhost";
    int port = 9300;

    cleanElasticSearch();

    Loader loader =
        new Loader(hostname, port, "elasticsearch", "http://localhost:8100", "user", "password");

    waitForHarvesterToComplete();

    Resource resource = new ClassPathResource(datasett);

    loader.loadDatasetFromFile(resource.getURL().toString());
    waitForHarvesterToComplete();

    elasticsearchClient.admin().indices().prepareRefresh().get();
  }
}
