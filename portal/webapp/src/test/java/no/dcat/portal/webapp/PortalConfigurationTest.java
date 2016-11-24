package no.dcat.portal.webapp;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Created by nodavsko on 17.10.2016.
 */
@RunWith(SpringRunner.class)
//@WebMvcTest( controllers = Application.class,  secure = false )
//@ContextConfiguration(classes = {PortalConfiguration.class, PortalSecurityConfig.class, MvcConfig.class})
//@AutoConfigureMockMvc (secure = false)
//@SpringBootTest(classes = { Application.class, PortalController.class, PortalConfiguration.class, PortalSecurityConfig.class, MvcConfig.class } , webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PortalConfigurationTest {
    private static Logger logger = LoggerFactory.getLogger(PortalConfigurationTest.class);

    /**
     * Denne skulle kjøre opp portalcontrolleren. TODO Fix
     *
     * @throws Exception
     */
    @Test
    public void versionStringIsNotNull() throws Exception {

        PortalConfiguration pc = new PortalConfiguration();

        String actual = pc.getVersionInformation();
        logger.info(actual);
        Assert.assertNotEquals("Version information is not null", null, actual);
    }

    @Test
    public void queryCallbackIsNotNull() {

        PortalConfiguration pc = new PortalConfiguration();
        String actual = pc.getQueryServiceUrl();
        logger.info(actual);
        Assert.assertNotEquals("Query Service URL is not null", null, actual);
    }

    /**
     * Her må portalen være opp å kjøre !
     */
    /*
    @Test
    public void versionNumberExist() {
        WebDriver driver = new HtmlUnitDriver();

        driver.get("http://localhost:8090");

        WebElement element = driver.findElement(By.id("versionInformation"));

        logger.info(element.getText());
        Assert.assertTrue(element.getText().startsWith("webapp-"));

        driver.quit();
    }*/
}
