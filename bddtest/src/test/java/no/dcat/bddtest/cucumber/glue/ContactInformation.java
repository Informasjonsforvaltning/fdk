package no.dcat.bddtest.cucumber.glue;

import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


/**
 * Created by dask on 26.01.2017.
 */
public class ContactInformation extends CommonPage {
    private static Logger logger = LoggerFactory.getLogger(ContactInformation.class);

    @Before
    public void setup() {
        setupDriver();
    }

    @After
    public void shutdown() {
        stopDriver();
    }




    @Then("^the following datasets shall have contact information as specified:$")
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


                assertTrue("Detail page has title ", driver.getTitle() != null);
                openPageWaitRetry("detail?id="+ dsId, "detailspage", 10 );
                if (!"".equals(name)) {
                    WebElement nameElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='Navn']/following-sibling::dd[1]"));
                    assertEquals(name, nameElement.getText());
                }

                if (!"".equals(email)) {
                    WebElement emailElement = driver.findElement(By.xpath("//h3[.='Kontaktinformasjon']/../dl/dt[.='E-post']/following-sibling::dd[1]"));
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


}
