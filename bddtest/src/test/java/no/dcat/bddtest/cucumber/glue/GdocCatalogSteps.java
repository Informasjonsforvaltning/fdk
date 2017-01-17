package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import no.dcat.bddtest.WebDriverFactory;
import no.dcat.bddtest.elasticsearch.client.DeleteIndex;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import static java.lang.Thread.sleep;
import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 * Created by dask on 16.12.2016.
 */
@Configuration
@ConfigurationProperties(prefix = "application")
public class GdocCatalogSteps {

    private final WebDriver driver = WebDriverFactory.createWebDriver();

    private static Logger logger = LoggerFactory.getLogger(GdocCatalogSteps.class);

    @Value("${portal}")
    public static String PORTAL_URL = "http://localhost:8080"; // = "http://fdk-por-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://portal-fdk.tt1.brreg.no";

    @Value("${admin")
    public static String ADMIN_URL = "http://localhost:8082"; // = "http://fdk-adm-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://admin-fdk.tt1.brreg.no";

    @Value("${gdoc}")
    public static String GDOC_CONVERT_URL = "http://localhost:8084"; //  = "http://192.168.99.100:8084/convert";

    @Value("${elasticsearch.host")
    private static String elasticsearch_host = "http://localhost"; // = "http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/";

    @Value("${elasticsearch.port")
    private static int    elasticsearch_port  = 9200;

    @Given("^Databasen er tom\\.$")
    public void cleanElasticSearch() throws Throwable {

        new DeleteIndex(elasticsearch_host, elasticsearch_port).deleteIndex("dcat");
    }


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
        harvest.click();

        logger.info("harvest-url " + harvest.getAttribute("href"));

        sleep(15000); // to allow for harvest time

    }

    @When("^brukeren åpner portalen$")
    public void brukerÅpnerPortalen() throws Throwable {
        driver.get(PORTAL_URL);

    }

    @Then("^søker etter \"([^\"]*)\"\\.$")
    public void søkerEtter(String title) throws Throwable {

        WebElement element = driver.findElement(By.id("search"));
        element.sendKeys(title);
        element.submit();

        sleep(2000);

    }
    @Then("^skal datasettet med tittel \"([^\"]*)\" finnes øverst på resultatsiden$")
    public void datasettMedTittelSkalFinneØverst(String title) throws Throwable {
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
