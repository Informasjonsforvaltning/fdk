package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.When;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Thread.sleep;

/**
 * Created by dask on 16.12.2016.
 */
public class HarvestSteps extends CommonPage {

    //TODO: Refaktorer i harvest og portalsteg. Se også på backgroundpage og commonpage.
    //TODO: slett ubrukte stegdefinisjoenr

    //  private final WebDriver driver = WebDriverFactory.createWebDriver();

    private static Logger logger = LoggerFactory.getLogger(HarvestSteps.class);

    public static String ADMIN_URL = "http://localhost:8082"; // = "http://fdk-adm-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://admin-fdk.tt1.brreg.no";


    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }


    @When("^I open the harvester administration page$")
    public void userOpensAdminPortal() throws Throwable {

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
        sleep(2000);

    }


    @When("^I select harvest \"([^\"]*)\" catalog$")
    public void doHarvestGdoc(String query) throws Throwable {

        CatalogForCucumberTest catalog = catalogsToHarvest.get(query);
        if(catalog == null){
            throw new IllegalStateException("Query should be difi, was: "+query);
        }

        By xpath = By.xpath("//tr[td[contains(text(),'" + catalog.urlInput + "')]]");
        if (driver.findElements(xpath).size() == 0) {
            registerCatalog(catalog.descriptionInput, catalog.urlInput, catalog.orgnummer);
        }

        sleep(1000);

        WebElement row = driver.findElement(xpath);
        WebElement harvest = row.findElement(By.xpath("td/a[contains(@href,'admin/harvestDcatSource?')]"));
        logger.info("harvest-url " + harvest.getAttribute("href"));

        harvest.click();

        sleep(1000);
        waitForHarvesterToComplete();

    }


    void registerCatalog(String descriptionInput, String urlInput, String orgnrInput) {
        WebElement description = driver.findElement(By.id("inputDescription"));
        description.sendKeys(descriptionInput);
        WebElement url = driver.findElement(By.id("inputUrl"));
        url.sendKeys(urlInput);
        WebElement orgnumber = driver.findElement(By.id("inputOrgnumber"));
        orgnumber.sendKeys(orgnrInput);

        WebElement saveButton = driver.findElement(By.xpath("/html/body/div/div[3]/div[1]/button"));
        saveButton.click();

    }

    static class CatalogForCucumberTest{
        String descriptionInput;
        String urlInput;
        String orgnummer;

        CatalogForCucumberTest(String descriptionInput, String urlInput, String orgnummer) {
            this.descriptionInput = descriptionInput;
            this.urlInput = urlInput;
            this.orgnummer = orgnummer;
        }
    }

    private static Map<String, CatalogForCucumberTest> catalogsToHarvest = new HashMap<>();

    static {
       catalogsToHarvest.put("difi", new CatalogForCucumberTest("difi katalog", "http://data.norge.no/api/dcat2/991825827/data.jsonld", "991825827"));
    }

}
