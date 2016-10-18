package no.dcat.portal.webapp;

import com.gargoylesoftware.htmlunit.TextPage;
import com.gargoylesoftware.htmlunit.WebClient;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.*;

/**
 * Created by nodavsko on 17.10.2016.
 */
@RunWith(SpringRunner.class)
@WebMvcTest( controllers = Application.class,  secure = false )
@ContextConfiguration(classes = {PortalConfiguration.class, PortalSecurityConfig.class, MvcConfig.class})
//@AutoConfigureMockMvc (secure = false)
//@SpringBootTest(classes = { Application.class, PortalController.class, PortalConfiguration.class, PortalSecurityConfig.class, MvcConfig.class } , webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebappIntegrationTests {
    private static Logger logger = LoggerFactory.getLogger(WebappIntegrationTests.class);


    @Autowired
    private WebClient webClient;


    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private MockMvc mockMvc;

    /*
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.webClient = webAppContextSetup()
    }*/

    /**
     * Denne skulle kjøre opp portalcontrolleren. TODO Fix
     *
     * @throws Exception
     */
    @Test
    public void testExample() throws Exception {

    //PortalController c = new PortalController(pbm);
        webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
        TextPage page = webClient.getPage("/");

        logger.info(page.getContent());

        assertThat(page.getContent()).isEmpty();

    }

    /**
     * Her må portalen være opp å kjøre !
     */
    @Test
    public void versionNumberExist() {
        WebDriver driver = new HtmlUnitDriver();

        driver.get("http://localhost:8090");

        WebElement element = driver.findElement(By.id("versionInformation"));

        logger.info(element.getText());
        Assert.assertTrue(element.getText().startsWith("webapp-"));

        driver.quit();
    }
}
