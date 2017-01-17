package no.dcat.bddtest.cucumber.glue;

import com.google.common.base.Predicate;
import io.github.bonigarcia.wdm.PhantomJsDriverManager;
import no.dcat.bddtest.cucumber.SpringIntegrationTestConfig;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;

import com.google.common.base.Predicate;
import io.github.bonigarcia.wdm.PhantomJsDriverManager;
import no.dcat.bddtest.cucumber.SpringIntegrationTestConfig;
import org.apache.commons.lang3.StringUtils;;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Common class for glue-code for pagetesting.
 */
public abstract class CommonPage extends SpringIntegrationTestConfig {
    private final Logger logger = LoggerFactory.getLogger(CommonPage.class);
    WebDriver driver = null;

    public void openPage(String page) {
        String hostname = "localhost";
        int port = 8080;

        driver.get(String.format("http://%s:%d/%s", hostname, port, page));
    }

    public boolean openPageWaitRetry(String page, String idToFind, int waitTimes) {
        return openPageWaitRetry(page, d -> driver.findElement(By.id(idToFind)).isDisplayed(), waitTimes);
    }

    public boolean openPageWaitRetry(String page, Predicate<WebDriver> waitCondition, int waitTimes) {
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
            openPageWaitRetry(page, waitCondition, --waitTimes);
        }
        return false;
    }

    protected String getEnv(String env) {
        String value = System.getenv(env);

        if (StringUtils.isEmpty(value)) {
            throw new RuntimeException(String.format("Environment %s variable is not defines.", env));
        }

        return value;
    }

    protected void setupDriver() {
        PhantomJsDriverManager.getInstance().setup();
        driver = new PhantomJSDriver();
    }


    protected void stopDriver() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected int getEnvInt(String env) {
        return Integer.valueOf(getEnv(env));
    }
}
