package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertEquals;
import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 * Cucumber glue class for the detail feature.
 */
public class DetailPage extends CommonPage {
    private static final Logger logger = LoggerFactory.getLogger(DetailPage.class);

    public static final String ID_PROVENANCE_TEXT = "provenanceText";
    public static final String ID_LANGUAGE_TEXT = "languageText";
    public static final String ID_LOCATIONS_TEXT = "locationsText";
    public static final String ID_ACCESS_RIGTH_TEXT = "accessRightText";
    public static final String ID_ACCRUAL_PERIODICITY_TEXT = "accrualPeriodicityText";
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
        } finally {
            driver.close();
        }
    }

    void check(String pageUrl, String[] values, String[] idrefs) {

        openPageWaitRetry(String.format(NOR_PAGE, pageUrl), idrefs[0], 2);

        int i = 0;
        for (String htmlId : idrefs ) {
            String value = values[i++];

            if (value != null && !"".equals(value)) {

                String textActual = driver.findElement(By.id(htmlId)).getText();
                assertTrue(String.format("The user %s shall have %s equal to %s", pageUrl, htmlId, value),
                        value.equals(textActual));

            }
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
