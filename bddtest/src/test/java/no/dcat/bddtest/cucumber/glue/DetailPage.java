package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
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
    public static final String ID_FREQUENCE_TEXT = "accruralPeriodicityText";

    private final String NOR_PAGE = "detail?id=%s";
    private final String ENG_PAGE = "detail?id=%s";

    @Given("^I open the browser\\.$")
    public void i_open_the_browser() throws Throwable {
        openBrowser();
    }

    @Then("^the following dataset shall have the following norwegian properties \\(id, provenance, frequency, language, access-rigth, locations\\):$")
    public void norwegianProperties(DataTable datasets) throws Throwable {
        try {
            List<List<String>> dataset = datasets.raw();

            for (List<String> dsProperties : dataset) {
                String id = dsProperties.get(0);
                openPage(String.format(NOR_PAGE, id));

                String provenanceText = dsProperties.get(1);
                String provenanceTextActual = getElement(ID_PROVENANCE_TEXT);
                assertTrue(String.format("The user %s shall have provenance equal to %s but had %s", id, provenanceText, provenanceTextActual),
                        provenanceText.equals(provenanceTextActual));

                String frequenceText = dsProperties.get(2);
                String frequenceTextActual = getElement(ID_FREQUENCE_TEXT);
                assertTrue(String.format("The user %s shall have frequency equal to %s but had %s", id, frequenceText, frequenceTextActual),
                        frequenceText.equals(frequenceTextActual));

                String languageText = dsProperties.get(3);
                String languageTextActual = getElement(ID_LANGUAGE_TEXT);
                assertTrue(String.format("The user %s shall have language equal to %s but had %s", id, languageText, languageTextActual),
                        languageText.equals(languageTextActual));

                String accessRigthText = dsProperties.get(4);
                String accessRigthTextActual = getElement(ID_ACCESS_RIGTH_TEXT);
                assertTrue(String.format("The user %s shall have access-rigth equal to %s but had %s", id, accessRigthText, accessRigthTextActual),
                        accessRigthText.equals(accessRigthTextActual));

                String locationsText = dsProperties.get(5);
                String locationsTextActual = getElement(ID_LOCATIONS_TEXT);
                assertTrue(String.format("The user %s shall have location equal to %s but had %s", id, locationsText, locationsTextActual),
                        locationsText.equals(locationsTextActual));
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
