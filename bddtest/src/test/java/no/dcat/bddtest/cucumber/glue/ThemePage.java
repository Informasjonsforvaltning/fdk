package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import io.github.bonigarcia.wdm.PhantomJsDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.net.MalformedURLException;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 *
 */
public class ThemePage {
    WebDriver driver = null;

    @Given("^I have open the browser$")
    public void openBrowser() throws MalformedURLException {
        /*File file = new File("src/test/resources/IEDriverServer.exe");
        File fileC = new File("src/test/resources/chromedriver.exe");
        File fileF = new File("src/test/resources/phantomjs.exe");

        System.setProperty("webdriver.ie.driver", file.getAbsolutePath());
        System.setProperty("webdriver.chrome.driver", fileC.getAbsolutePath());
        System.setProperty("phantomjs.binary.path", fileF.getAbsolutePath());

        DesiredCapabilities caps = DesiredCapabilities.internetExplorer();
        DesiredCapabilities capsC = DesiredCapabilities.chrome();
        caps.setCapability("ignoreZoomSetting", true);

        ChromeOptions options = new ChromeOptions();
        options.setBinary(fileC.getAbsolutePath());
        */

        //driver = new InternetExplorerDriver(caps);
        //driver = new ChromeDriver(capsC);
        PhantomJsDriverManager.getInstance().setup();
        driver = new PhantomJSDriver();
        //driver = new ChromeDriver();


    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK() {
        driver.get("http://localhost:8081/");
        //driver.navigate().to("http://localhost:8081/");
        //driver.getPageSource();
    }

    @Then("^link befolking og samfunn should exist$")
    public void ThemeBoS() {
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());
        driver.close();
    }
}
