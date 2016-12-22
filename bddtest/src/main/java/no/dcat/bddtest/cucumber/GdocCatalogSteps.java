package no.dcat.bddtest.cucumber;

import cucumber.api.java.After;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import no.dcat.bddtest.WebDriverFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.lang.Thread.sleep;
import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 * Created by dask on 16.12.2016.
 */
public class GdocCatalogSteps {

    private final WebDriver driver = WebDriverFactory.createWebDriver();

    private static Logger logger = LoggerFactory.getLogger(GdocCatalogSteps.class);

    public static String PORTAL_URL = "http://fdk-por-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://portal-fdk.tt1.brreg.no";
    public static String ADMIN_URL = "http://fdk-adm-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://admin-fdk.tt1.brreg.no";
    public static String GDOC_CONVERT_URL  = "http://192.168.99.100:8084/convert";
    public static String GDOC_LATEST_URL  = "http://192.168.99.100:8084/versions/latest";


    @Given("^brukeren har lagt til nytt datasett med tittel \"([^\"]*)\" i google dokumentet$")
    public void brukerenHarLagtTilNyttDatasettMedTittelTitleGoogleDokumentet(String title) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        //throw new cucumber.api.PendingException();
    }

    @Given("^brukeren starter gdok-konverteringen$")
    public void brukerenStarterGdokKonverteringen() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        //throw new cucumber.api.PendingException();
        driver.get(GDOC_CONVERT_URL);
    }

    @Given("^brukeren går inn i admin-grensesnittet og velger harvest 'gdok-katalog'$")
    public void brukerenGårInnIAdmingrensesnittetOgVelgerHarvest() throws Throwable {

        driver.get(ADMIN_URL);
        // log inn
        WebElement user = driver.findElement(By.name("username"));
        WebElement password = driver.findElement(By.name("password"));
        if (user != null && password != null) {
            user.sendKeys("test_admin");
            password.sendKeys("password");
            WebElement submit = driver.findElement(By.name("submit"));
            submit.submit();
        }

        // find gdoc import

        WebElement row = driver.findElement(By.xpath("//tr[td[contains(text(),'gdoc')]]"));
        WebElement harvest = row.findElement(By.xpath("td/a[contains(@href,'admin/harvestDcatSource?')]"));

        logger.info("harvest-url " + harvest.getAttribute("href"));

        sleep(15000); // to allow for harvest time

    }

    @When("^brukeren åpner portalen$")
    public void brukerÅpnerPortalen() throws Throwable {
        driver.get(PORTAL_URL);

    }

    @Then("^datasettet med tittel \"([^\"]*)\" skal finnes$")
    public void datasettMedTittelSkalFinnes(String title) throws Throwable {

        WebElement element = driver.findElement(By.id("search"));
        element.sendKeys(title);
        element.submit();

        sleep(2000);

        WebElement results = driver.findElement(By.id("datasets"));
        WebElement heading = results.findElement(By.tagName("h4"));
        String actual = heading.getText();

        logger.info("actual: " + actual + " expected: "+ title);
        assertTrue(actual.startsWith(title));

    }


    @After()
    public void closeBrowser() {
        driver.quit();
    }
}
