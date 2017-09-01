package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.awaitility.Awaitility.await;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertTrue;
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

    @Then("^all the themes should be visible in the theme pane$")
    public void all_the_themes_should_be_visible_in_the_theme_pane(){
        Set<String> collect = driver
                .findElements(By.cssSelector(".sk-item-list a"))
                .stream()
                .map(element -> element.getText())
                .collect(Collectors.toSet());

        Set<String> expectedAtLeast = new HashSet<>(Arrays.asList(
                "Jordbruk, fiskeri, skogbruk og mat\n(1)",
                "Energi\n(3)",
                "Regioner og byer\n(1)",
                "Helse\n(1)"
        ));

        assertTrue(Arrays.toString(collect.toArray()) + " should contain all of "+Arrays.toString(expectedAtLeast.toArray()), collect.containsAll(expectedAtLeast));


    }

}
