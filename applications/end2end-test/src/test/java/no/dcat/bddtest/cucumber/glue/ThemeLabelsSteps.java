package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

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
        openPageWaitRetry("http://" + portalHostname + ":" + portalPort +"/",
                d -> driver.findElement(By.xpath("//div[@class='fdk-header-beta']")).isDisplayed(), 5);
    }


    @Then("^I should see all the existing themes$")
    public void i_should_see_all_the_existing_themes() throws Throwable {
        // sjekke at et tema eksisterer
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());

    }

    @Then("^I should be able to click on the (\\d+) themes$")
    public void i_should_be_able_to_click_on_the_themes(int numberOfThemes) throws Throwable {
        // sjekke at et tema er en klikkbar lenke
        List<WebElement> publisher = driver.findElements(By.xpath("//a[contains(@href, '/datasets')]"));
        assertThat(publisher.size(), is(numberOfThemes));
    }

    @Then("\"beta-versjon\" shall appear in a topline")
    public void beta_version_shall_appear_in_topline() {
        WebElement betaline = driver.findElement(By.xpath("//div[@class='fdk-header-beta']"));
        assertNotEquals(betaline,null);
        boolean norsk =betaline.getText().contains("beta-versjon");
        assertThat(norsk, is(true));
    }

    @Then("there should exist a link \"tilbakemeldinger\" for email input")
    public void there_should_exist_a_feedback_link() {
        WebElement feedback = driver.findElement(By.xpath("//div/a[@href='mailto:fellesdatakatalog@brreg.no?subject=Tilbakemelding Felles datakatalog']"));
        assertThat(feedback.getText(), is("tilbakemeldinger") );
    }

}
