package no.dcat.bddtest.cucumber.glue;

import io.github.bonigarcia.wdm.WebDriverManager;
import no.dcat.bddtest.cucumber.SpringIntegrationTestConfigE2E;
import no.dcat.datastore.Elasticsearch;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.function.Function;


import static org.junit.Assert.assertTrue;

/**
 * Common class for glue-code for pagetesting.
 */
public abstract class CommonPage extends SpringIntegrationTestConfigE2E {
  private final Logger logger = LoggerFactory.getLogger(CommonPage.class);
  WebDriver driver = null;


  public void openPage(String page) {

    assertTrue("page should be an actual web page, was: " + page, page.startsWith("http://"));

    driver.get(page);
  }

  public boolean openPageWaitRetry(String page, String idToFind, int waitTimes) {
        return openPageWaitRetry(page, d -> driver.findElement(By.id(idToFind)).isDisplayed(), waitTimes);
  }

    public boolean openPageWaitRetry(String page, Function<? super WebDriver, Boolean> waitCondition, int waitTimes) {
    logger.info(String.format("Waiting for page %s %d times", page, waitTimes));

    openPage(page);

    if (waitTimes <= 0) {
      return false;
    }
    try {
      WebDriverWait wait = new WebDriverWait(driver, 10);
      wait.until(waitCondition);
      return true;
    } catch (TimeoutException toe) {
      return openPageWaitRetry(page, waitCondition, --waitTimes);
    }
  }

  protected String getEnv(String env) {
    String value = System.getenv(env);

    if (StringUtils.isEmpty(value)) {
      throw new RuntimeException(String.format("Environment %s variable is not defines.", env));
    }

    return value;
  }

  protected void setupDriverChrome() {
        WebDriverManager.chromedriver().setup();

    DesiredCapabilities dcap = new DesiredCapabilities();
        String[] chromeArgs = new  String[] {
                "headless",
                "window-size=1200x600"
        };
    dcap.setCapability(ChromeDriverService.CHROME_DRIVER_EXE_PROPERTY, chromeArgs);

    driver = new ChromeDriver();

  }

  protected void setupDriver() {
        WebDriverManager.config().setTimeout(30);
        WebDriverManager.config().setTargetPath(".");
        WebDriverManager.config().setDriverExport("fdk");

        WebDriverManager.phantomjs().setup();
    DesiredCapabilities dcap = new DesiredCapabilities();
        String[] phantomArgs = new  String[] {
                "--webdriver-loglevel=NONE"
        };
    dcap.setCapability(PhantomJSDriverService.PHANTOMJS_CLI_ARGS, phantomArgs);
        dcap.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, ".\\phantomjs\\windows\\");

    driver = new PhantomJSDriver(dcap);
  }


  protected void stopDriver() {
    if (driver != null) {
            logger.info("Current URL: " + driver.getCurrentUrl());
      driver.quit();
    }
  }

  protected int getEnvInt(String env) {
    return Integer.valueOf(getEnv(env));
  }


  void waitForHarvesterToComplete() {

    int maxTries = 60;
    while (true) {
      logger.info("Waiting for harvester to become idle.");
      boolean harvesterIdle = harvesterIsIdle();

      try {
        Thread.sleep(1000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }

      // double check if harvester is idle
      harvesterIdle = harvesterIdle && harvesterIsIdle();

      if (harvesterIdle) return;

      try {
        Thread.sleep(1000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      if (maxTries-- < 0) {
                throw new RuntimeException("Tried to wait for harvester to complete for 60 seconds without it completing.");
      }
    }

  }


  private boolean harvesterIsIdle() {
        Map<String, Boolean> forObject = new RestTemplate().getForObject("http://localhost:8081/api/admin/isIdle", Map.class);
    return forObject.get("idle");
  }


    void refreshElasticsearch(String clusterNodes, String clusterName){
        try (Elasticsearch elasticsearch = new Elasticsearch(clusterNodes, clusterName)) {
            elasticsearch.getClient().admin().indices().prepareRefresh().get();
        }
    }

}
