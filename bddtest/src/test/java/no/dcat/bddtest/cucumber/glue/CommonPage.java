package no.dcat.bddtest.cucumber.glue;

import io.github.bonigarcia.wdm.PhantomJsDriverManager;
import no.dcat.bddtest.cucumber.SpringIntegrationTestConfig;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;

/**
 * Common class for glue-code for pagetesting.
 */
public abstract class CommonPage extends SpringIntegrationTestConfig {
    WebDriver driver = null;

    public void openBrowser() throws Throwable {
        PhantomJsDriverManager.getInstance().setup();
        driver = new PhantomJSDriver();
    }

    public void openPage(String page) throws Throwable {
        String hostname = "localhost";
        int port = 8080;

        driver.navigate().to(String.format("http://%s:%d/%s", hostname, port, page));
    }

    protected String getEnv(String env) {
        String value = System.getenv(env);

        if (StringUtils.isEmpty(value)) {
            throw new RuntimeException(String.format("Environment %s variable is not defines.", env));
        }

        return value;
    }

    protected int getEnvInt(String env) {
        return Integer.valueOf(getEnv(env));
    }
}
