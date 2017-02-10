package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 * Created by bjg on 09.02.2017.
 *
 * Glue code for test FDK-241 themeLabels
 */
public class ThemeLabelsSteps extends CommonPage{
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


    @Given("^I am on the homepage of the National Data Catalog$")
    public void i_am_on_the_homepage_of_the_National_Data_Catalog() throws Throwable {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }


    @Then("^I should see all the existing themes$")
    public void i_should_see_all_the_existing_themes() throws Throwable {
        // sjekke at et tema eksisterer
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());

    }

    @Then("^I should be able to click on the (\\d+) themes$")
    public void i_should_be_able_to_click_on_the_themes(int numberOfThemes) throws Throwable {
        // sjekke at et tema er en klikkbar lenke
        List<WebElement> publisher = driver.findElements(By.xpath("//a[contains(@href, '/result')]"));
        assertThat(publisher.size(), is(numberOfThemes));
    }



}
