package no.dcat.bddtest.cucumber;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;

import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;

/**
 *
 */
public class ThemePage {
    WebDriver driver = null;

    @Given("^I have open the browser$")
    public void openBrowser() {
        //File file = new File("C:/development/fdk/bddtest/src/main/resources/IEDriverServer.exe");
        File file = new File("src/main/resources/IEDriverServer.exe");
        System.setProperty("webdriver.ie.driver", file.getAbsolutePath());

        DesiredCapabilities caps = DesiredCapabilities.internetExplorer();
        caps.setCapability("ignoreZoomSetting", true);

        driver = new InternetExplorerDriver(caps);
    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK() {
        driver.navigate().to("http://localhost:8081/");
    }

    @Then("^link befolking og samfunn should exist$")
    public void ThemeBoS() {
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());
        driver.close();
    }
}
