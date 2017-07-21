package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.PendingException;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static java.lang.Thread.sleep;
import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;


/**
 * Cucumber glue class for the detail feature.
 */
public class DetailPage extends CommonPage {
    private static final Logger logger = LoggerFactory.getLogger(DetailPage.class);

    private static final String ID_PROVENANCE_TEXT = "provenanceText";
    private static final String ID_LANGUAGE_TEXT = "languageText";
    private static final String ID_LOCATIONS_TEXT = "locationsText";
    private static final String ID_ACCESS_RIGTH_TEXT = "accessRightText";
    private static final String ID_ACCRUAL_PERIODICITY_TEXT = "accrualPeriodicityText";
    private final String PAGE_URL = PORTAL_URL+"/datasets?id=%s&lang=%s";
    private String langId = "nb";

    private String detailPageUrl(String datasetName) {
        return String.format(PAGE_URL, datasetName, langId);
    }

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    @Given("^I change page-language to \"([^\"]*)\"$")
    public void changePageLanguage(String pageLanguage) throws Throwable {

        if ("English".equals(pageLanguage)) {
            langId="en";
        } else if ("Nynorsk".equals(pageLanguage)) {
            langId="nn";
        } else {
            langId="nb";
        }

    }

    @Then("^I should be able to download the dataset in the following formats:$")
    public void checkDownloadFormats(DataTable table) {
        List<List<String>> lines = table.raw();

        for (List<String> field : lines) {
            logger.info("Checking present {}", field);

            String format = field.get(0);

            logger.info("Checking format {}", format);
            List<WebElement> elems = driver.findElements(By.xpath("//a[contains(text(),'" + format + "')]"));
            assertThat(elems.size(), greaterThan(0));
        }
    }

    @Then("^all fields containing values should be displayed:$")
    public void checkFieldsThatShouldBeDisplayed(DataTable headings) throws Throwable {
        List<List<String>> lines = headings.raw();

        for (List<String> field : lines) {
            String title = field.get(0);

            logger.info("Checking present {}", title);
            String xpath = "//dt[text() = '"+ title + "']";
            List<WebElement> elems = driver.findElements(By.xpath(xpath));
            assertThat(elems.size(), greaterThan(0));

            WebElement value = driver.findElement(By.xpath(xpath + "/following-sibling::dd"));
            assertThat(value.getText(), not(isEmptyOrNullString()));

        }
    }

    @Then("^the fields not containing any values should be hidden:$")
    public void checkFieldsThatShouldNotBeDisplayed(DataTable headings) throws Throwable {
        List<List<String>> lines = headings.raw();

        for (List<String> field : lines) {
            String title = field.get(0);
            logger.info("Checking NOT present {}", title);
            List<WebElement> elems = driver.findElements(By.xpath("//dt[text() = '" + title + "']"));
            assertThat(elems.size(), is(0));
        }
    }

    @When("^I open the detailpage of dataset \"([^\"]*)\"$")
    public void openDetailpageOfDataset(String datasetId) throws Throwable {
        openPageWaitRetry(detailPageUrl(datasetId), "catalogName", 2);
    }

    @Then("^the following headings should be displayed:$")
    public void checkHeadings(DataTable headings) throws Throwable {

        List<List<String>> lines = headings.raw();

        for (List<String> heading : lines) {
            String h = heading.get(0);
            logger.info("Checking {}", h);

            WebElement actual = driver.findElement(By.xpath("//h3[text() = '" + h + "']"));
        }

    }

    @Then("^I see the following fields:$")
    public void seeTopFields(DataTable fields) {
        List<List<String>> line = fields.raw();

        for (List<String> field : line) {
            String attr = field.get(0);
            logger.info("Checking {}", attr);

            List<WebElement> elems = driver.findElements(By.xpath("//*[@aria-label = '" +attr + "']"));
            assertThat(elems.size(), is(1));
        }
    }

    @Then("^the following dataset shall have the following norwegian properties \\(id, provenance, frequency, language, access-right, locations\\):$")
    public void checkPropertyValues(DataTable datasets) throws Throwable {

            List<List<String>> dataset = datasets.raw();

            final String[] idrefs = {
                    ID_PROVENANCE_TEXT,
                    ID_ACCRUAL_PERIODICITY_TEXT,
                    ID_LANGUAGE_TEXT,
                    ID_ACCESS_RIGTH_TEXT,
                    ID_LOCATIONS_TEXT
            };

            for (List<String> dsProperties : dataset) {
                String id = dsProperties.get(0);

                String[] actualValues = {
                        dsProperties.get(1),
                        dsProperties.get(2),
                        dsProperties.get(3),
                        dsProperties.get(4),
                        dsProperties.get(5)
                };

                check(id, actualValues, idrefs);
            }

    }

    void check(String pageUrl, String[] values, String[] idrefs) {

        openPageWaitRetry(detailPageUrl(pageUrl), idrefs[0], 2);

        int i = 0;
        for (String htmlId : idrefs) {
            String value = values[i++];

            if (value != null && !"".equals(value)) {
                logger.info("Checking field {} equals {}",htmlId,value);

                String textActual = driver.findElement(By.id(htmlId)).getText();
                assertTrue(String.format("The dataset %s shall have %s equal to %s, actual is %s", pageUrl, htmlId, value, textActual),
                        value.equals(textActual));

            }
        }
    }

}
