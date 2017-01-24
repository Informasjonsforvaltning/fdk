package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import no.dcat.harvester.crawler.Loader;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 * Cucumber glue class for the detail feature.
 */
public class DetailPage extends CommonPage {
    public static final String ID_PROVENANCE_TEXT = "provenanceText";
    public static final String ID_LANGUAGE_TEXT = "languageText";
    public static final String ID_LOCATIONS_TEXT = "locationsText";
    public static final String ID_ACCESS_RIGTH_TEXT = "accessRightText";
    private final String NOR_PAGE = "detail?id=%s";
    private final String ENG_PAGE = "detail?id=%s";

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    @Given("^I open the browser\\.$")
    public void i_open_the_browser() throws Throwable {

    }

    @Then("^the following dataset shall have the following norwegian properties \\(id, provenance, frequency, language, access-right, locations\\):$")
    public void norwegianProperties(DataTable datasets) throws Throwable {
        try {
            List<List<String>> dataset = datasets.raw();

            for (List<String> dsProperties : dataset) {
                String id = dsProperties.get(0);
                openPage(String.format(NOR_PAGE, id));

                String provenanceText = dsProperties.get(1);
                String provenanceTextActual = driver.findElement(By.id(ID_PROVENANCE_TEXT)).getText();
                assertTrue(String.format("The user %s shall have provenance equal to %s", id, provenanceText),
                        provenanceText.equals(provenanceTextActual));

            }
        } finally {
            driver.close();
        }
    }

    /*@Then("^the following dataset shall have the following english properties:$")
    public void englishProperties(DataTable datasets) throws Throwable {
        try {
            List<List<String>> dataset = datasets.raw();

            for (List<String> dsProperties : dataset) {
                String id = dsProperties.get(0);
                openPage(String.format(ENG_PAGE, id));

                String provenanceText = dsProperties.get(1);
                String provenanceTextActual = driver.findElement(By.id(ID_PROVENANCE_TEXT)).getText();
                assertTrue(String.format("The user %s shall have provenance equal to %s", id, provenanceText),
                        provenanceText.equals(provenanceTextActual));

            }
        } finally {
            driver.close();
        }
    }*/
}
