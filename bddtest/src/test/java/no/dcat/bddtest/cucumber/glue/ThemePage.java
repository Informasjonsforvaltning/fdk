package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import io.github.bonigarcia.wdm.PhantomJsDriverManager;
import no.dcat.bddtest.cucumber.SpringIntegrationTestConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;

import java.net.MalformedURLException;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 *
 */
public class ThemePage extends SpringIntegrationTestConfig {
    WebDriver driver = null;

    private final String portalHostname = "localhost"; // getEnv("fdk.hostname");
    private int portalPort = 8080; //getEnvInt("fdk.port");

    @Before
    public void setup() {
        PhantomJsDriverManager.getInstance().setup();
        driver = new PhantomJSDriver();
    }

    @After
    public void shutdown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Given("^I have open the browser$")
    public void openBrowser() throws MalformedURLException {
//        PhantomJsDriverManager.getInstance().setup();
//        ChromeDriverManager.getInstance().setup();
//        driver = new PhantomJSDriver();
//        driver = new ChromeDriver();
    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");

        //driver.navigate().to("http://localhost:8081/");
        //driver.getPageSource();
    }

    @Then("^link befolking og samfunn should exist$")
    public void ThemeBoS() {
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());
        driver.quit();
    }


}
