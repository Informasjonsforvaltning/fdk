package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;


import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;
/**
 *
 */
public class ThemePage extends CommonPage {
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

    @Given("^I have open the browser$")
    public void openBrowser()  {
//        PhantomJsDriverManager.getInstance().setup();
//        ChromeDriverManager.getInstance().setup();
//        driver = new PhantomJSDriver();
//        driver = new ChromeDriver();
    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK_eng() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }

    @Then("^link '(.+)'$ should exist$")
    public void ThemeBoS_eng(String theme) {
        assertTrue(driver.findElement(By.id(theme)).isEnabled());
    }




    @When("^jeg åpner temasiden i fellesdatakatalog")
    public void goToFDK() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }

    @Then("^vises alle '(.+)'$")
    public void ThemeBoS(String theme) {
        assertTrue(driver.findElement(By.id(theme)).isEnabled());
    }

}
