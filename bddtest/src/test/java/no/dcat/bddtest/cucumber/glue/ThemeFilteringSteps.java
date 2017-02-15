package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import static org.junit.Assert.assertTrue;

/**
 * Created by bjg on 14.02.2017.
 */
public class ThemeFilteringSteps extends CommonPage {
    @Given("^I see all the existing themes$")
    public void i_see_all_the_existing_themes() throws Throwable {
        // Write code here that turns the phrase above into concrete actions    throw new PendingException();
    }

    @When("^I click on theme \"([^\"]*)\"$")
    public void i_click_on_theme(String arg1) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        assertTrue(false);
    }

    @Then("^the result list should show (\\d+) datasets$")
    public void the_result_list_should_show_datasets(int arg1) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        assertTrue(false);
    }

}
