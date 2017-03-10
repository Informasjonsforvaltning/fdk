package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Created by bjg on 15.02.2017.
 */
public class DetailPageSubjectsSteps extends CommonPage {
    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }


    @When("^I open the dataset with id \"([^\"]*)\"$")
    public void i_open_the_dataset_with_id(String datasetId) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        openPage("/datasets?id=" + datasetId);
    }


    @Then("^the detailpage shall appear$")
    public void the_detailpage_shall_appear() throws Throwable {
        assertTrue("The page has correct title: Detail view", driver.getTitle().equals("Detail view"));
    }


    @Then("^display the following headers:$")
    public void display_the_following_headers(DataTable headerTable) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        // For automatic transformation, change DataTable to one of
        // List<YourType>, List<List<E>>, List<Map<K,V>> or Map<K,V>.
        // E,K,V must be a scalar (String, Integer, Date, enum etc)
        try {
            List<List<String>> headers = headerTable.raw();

            for (List<String> headerValues : headers) {
                String headerName = headerValues.get(0);
                WebElement headerElement = driver.findElement(By.xpath("//h3[.='" + headerName +"']"));
                assertTrue("Header element should be found", headerElement != null);
            }
        } finally {
            driver.close();
        }
    }
}
