package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;
import java.util.List;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;
import static java.lang.Thread.sleep;

/**
 * Created by bjg on 23.01.2017.
 */
public class OnlyImportValidDatasetsSteps extends CommonPage {
    private static Logger logger = LoggerFactory.getLogger(GdocCatalogSteps.class);

    public static String PORTAL_URL = "http://localhost:8080"; // = "http://fdk-por-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://portal-fdk.tt1.brreg.no";
    public static String ADMIN_URL = "http://localhost:8082"; // = "http://fdk-adm-fellesdatakatalog-ut1.ose-npc.brreg.no/"; //"http://admin-fdk.tt1.brreg.no";
    private static String elasticsearch_host = "http://localhost"; // = "http://elasticsearch-fellesdatakatalog-ut1.ose-npc.brreg.no/";
    private static int elasticsearch_port = 9200;

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }

    //TODO: Denne er egentlig lik "I open the admin portal" i Gdoc-steps, men
    //metodene i denne klassen når ikke driver-variabelen som fikk innhold i Gdoc-steps
    @Given("^I open the administration portal$")
    public void userOpensAdministrationPortal() throws Throwable {

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


    void registerCatalog() {
        WebElement description = driver.findElement(By.id("inputDescription"));
        description.sendKeys("FDK-138");
        WebElement url = driver.findElement(By.id("inputUrl"));
        url.sendKeys("http://test:8080/html/dataset-FDK-138-validering.ttl");
        WebElement orgnumber = driver.findElement(By.id("inputOrgnumber"));
        orgnumber.sendKeys("987654");

        WebElement saveButton = driver.findElement(By.xpath("/html/body/div/div[3]/div[1]/button"));
        saveButton.click();
    }

    @Given("^I select harvest FDK-138 catalog$")
    public void doHarvestFDK138() throws Throwable {
        // wait until login complete, then find FDK-138 import
        sleep(2000);
        WebElement row;
        boolean catalogExists = driver.findElements(By.xpath("//tr[td[contains(text(),'FDK-138')]]")).size() > 0;
        String html = driver.getPageSource();

        if (!catalogExists) {
            registerCatalog();
            sleep(1000);
        }

        row = driver.findElement(By.xpath("//tr[td[contains(text(),'FDK-138')]]"));
        WebElement harvest = row.findElement(By.xpath("td/a[contains(@href,'admin/harvestDcatSource?')]"));
        logger.info("harvest-url " + harvest.getAttribute("href"));

        harvest.click();

        sleep(2000); // to allow for harvest time
    }


    //TODO: Duplisert med Gdoc-steps, litt endret ordlyd for å gjøre den unik
    @Then("^the following dataset detail pages exists:$")
    public void datasetPageExists(DataTable datasets) throws Throwable {
        try {

            for (List<String> dataset : datasets.raw()) {
                String dsId = dataset.get(0);
                logger.info("Test dataset {}",dsId);

                openPageWaitRetry("detail?id="+ dsId, "languageText", 5);
                String contents = driver.getPageSource();
                assertTrue("Detail page has title ", driver.getTitle() != null);
            }
        } catch (Exception e) {
            logger.error("Could not check for deleted dataset: " + e.toString());
        }
    }

    @Then("^the following dataset detail pages shall not exist:$")
    public void datasetPageNotExists(DataTable datasets) throws Throwable {
        try {

            for (List<String> dataset : datasets.raw()) {
                String dsId = dataset.get(0);
                logger.info("Test dataset {}",dsId);

                openPageWaitRetry("detail?id="+ dsId, "languageText", 5);

                assertTrue("Error page is returned ", driver.getTitle().contains("Error page"));
            }
        } finally {
            driver.close();
        }
    }

}
