package no.dcat.portal.webapp;

import com.gargoylesoftware.htmlunit.DefaultCredentialsProvider;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.*;

/**
 * Created by nodavsko on 17.10.2016.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(PortalController.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnableAutoConfiguration(exclude = {org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration.class})
public class WebappTests {
    private static Logger logger = LoggerFactory.getLogger(WebappTests.class);

    @Autowired
    private WebClient webClient;

    @Autowired
    private WebApplicationContext wac;

    @MockBean
    private PortalConfiguration config;

    /*
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.webClient = webAppContextSetup()
    }*/

    @Test
    public void testExample() throws Exception {
       //PortalController c = new PortalController(pbm);

        DefaultCredentialsProvider cp = (DefaultCredentialsProvider) webClient.getCredentialsProvider();
        cp.addNTLMCredentials("user", "password", proxyHost, proxyPort, null, domain);

        HtmlPage page = this.webClient.getPage("/");

        assertThat(page.getBody().getTextContent()).isNotEmpty();

    }

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
