package no.dcat.bddtest.cucumber;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
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
        //System.out.println(HttpClientBuilder.class.getProtectionDomain().getCodeSource().getLocation());
        //driver = new FirefoxDriver();
        //WebDriver driver = new FirefoxDriver();

        //driver.get("http://localhost:8081");
        //File file = new File("C:/development/fdk/bddtest/src/main/resources/IEDriverServer.exe");
        File file = new File("src/main/resources/IEDriverServer.exe");
        File fileC = new File("src/main/resources/chromedriver.exe");
        System.setProperty("webdriver.ie.driver", file.getAbsolutePath());
        System.setProperty("webdriver.chrome.driver", fileC.getAbsolutePath());

        DesiredCapabilities caps = DesiredCapabilities.internetExplorer();
        DesiredCapabilities capsC = DesiredCapabilities.chrome();
        caps.setCapability("ignoreZoomSetting", true);

        ChromeOptions options = new ChromeOptions();
        options.setBinary(fileC.getAbsolutePath());

        //driver = new InternetExplorerDriver(caps);
        driver = new ChromeDriver(capsC);
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
