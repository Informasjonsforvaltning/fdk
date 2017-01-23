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

    @Then ("^the following datasets shall have contact information as specified:$")
    public void contactInformation(DataTable datasets) throws Throwable {
        try {

            for (List<String> dataset : datasets.raw()) {
                String dsId = dataset.get(0);
                logger.info("Test dataset {}",dsId);
                String name = dataset.get(1);
                String email = dataset.get(2);
                String telephone = dataset.get(3);
                String organization = dataset.get(4);
                String orgUnit = dataset.get(5);

                openPage("detail?id="+ dsId);

                assertTrue("Detail page has title ", driver.getTitle() != null);
                if (!"".equals(name)) {
                    WebElement nameElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Navn']/following-sibling::dd[1]"));
                    assertEquals(name, nameElement.getText());
                }

                if (!"".equals(email)) {
                    WebElement emailElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Epost']/following-sibling::dd[1]"));
                    assertEquals(email, emailElement.getText());
                }

                if (!"".equals(telephone)) {
                    WebElement telephoneElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Telefon']/following-sibling::dd[1]"));
                    assertEquals(telephone, telephoneElement.getText());
                }

                if (!"".equals(organization)) {
                    WebElement organisationElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Organisasjon']/following-sibling::dd[1]"));
                    assertEquals(organization, organisationElement.getText());
                }

                if (!"".equals(orgUnit)) {
                    WebElement orgUnitElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Organisasjonsenhet']/following-sibling::dd[1]"));
                    assertEquals(orgUnit, orgUnitElement.getText());
                }
            }
        } finally {
            driver.close();
        }
    }


    @Then("^the following dataset shall have the following norwegian properties \\(id, provenance, frequency, language, access-rigth, locations\\):$")
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
