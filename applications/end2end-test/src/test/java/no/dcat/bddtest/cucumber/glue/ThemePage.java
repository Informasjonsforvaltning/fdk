package no.dcat.bddtest.cucumber.glue;


import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertTrue;


/**
 * Cucumber glue class for the Themepage feature.
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

    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK_eng() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }

    @Then("^link '(.+)'$ should exist$")
    public void themeBoS_eng(String theme) {
        assertTrue(driver.findElement(By.id(theme)).isEnabled());
    }

    @When("^jeg åpner temasiden i fellesdatakatalog")
    public void goToFDK() {

        driver.get("http://" + portalHostname + ":" + portalPort +"/");
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }


    @Then("vises følgende tema og antall:$")
    public void ThemeBoS(DataTable themes) {

        for (List<String> themeAndAntall : themes.raw()) {

            String theme = themeAndAntall.get(0);
            String antall = themeAndAntall.get(1);

            WebElement themeElement = driver.findElement(By.id(theme));
            assertTrue(themeElement.isEnabled());

            WebElement themeCount = themeElement.findElement(By.name("hits"));
            String count = themeCount.getAttribute("innerHTML");

            assertThat( String.format("Antall stemmer ikke med forventet antall for %s", theme),  count, is(antall));
        }
    }
}

