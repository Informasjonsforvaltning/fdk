package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.awaitility.Awaitility.await;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.fail;

/**
 * Created by bjg on 14.02.2017.
 */
public class ThemeFilteringSteps extends CommonPage {

    private String themeLink;

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }


    @When("^I click on theme \"([^\"]*)\"$")
    public void i_click_on_theme(String theme) throws Throwable {
        driver.get(PORTAL_URL);
        WebElement themeElement = driver.findElement(By.id(theme));
        themeLink = themeElement.getAttribute("href");
        driver.get(themeLink);
        Thread.sleep(1000);

    }

    @Then("^the result list should show (\\d+) datasets$")
    public void the_result_list_should_show_datasets(int expectedNoOfDatasets) throws Throwable {
        WebElement actualHits = driver.findElement(By.className("sk-hits-stats__info"));
        String expected = String.format("Søket ga %d treff", expectedNoOfDatasets);

        assertThat(actualHits.getText(), is(expected));
    }

}
