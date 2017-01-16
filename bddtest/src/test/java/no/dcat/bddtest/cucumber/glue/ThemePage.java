package no.dcat.bddtest.cucumber.glue;


import cucumber.api.DataTable;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openqa.selenium.By;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.io.File;
import java.net.MalformedURLException;



import static com.thoughtworks.selenium.SeleneseTestBase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;


/**
 * Cucumber glue class for the Themepage feature.
 */
public class ThemePage {
    WebDriver driver = null;

    @Given("^I have open the browser$")
    public void openBrowser() throws MalformedURLException {
        File file = new File("src/test/resources/IEDriverServer.exe");
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

        //driver = new InternetExplorerDriver(caps);
        //driver = new ChromeDriver(capsC);
        driver = new PhantomJSDriver();
        //driver = new ChromeDriver();
    }

    @When("^I open Fellesdatakatalog website$")
    public void goToFDK_eng() {
        driver.get("http://" + portalHostname + ":" + portalPort +"/");
    }

    @Then("^link '(.+)'$ should exist$")
    public void themeBoS_eng(String theme) {
        assertTrue(driver.findElement(By.id(theme)).isEnabled());
    }

    @When("^jeg åpner temasiden i fellesdatakatalog")
    public void goToFDK() {
        driver.get("http://localhost:8081/");
        //driver.navigate().to("http://localhost:8081/");
        //driver.getPageSource();
    }


    @Then("^link befolking og samfunn should exist$")
    public void ThemeBoS() {
        assertTrue(driver.findElement(By.id("Befolkning og samfunn")).isEnabled());
        driver.close();


    @Then("vises følgende tema og antall:$")
    public void ThemeBoS(DataTable themes) {

        for (List<String> themeAndAntall : themes.raw()) {

            String theme = themeAndAntall.get(0);
            String antall = themeAndAntall.get(1);

            WebElement themeElement = driver.findElement(By.id(theme));
            assertTrue(themeElement.isEnabled());

            WebElement themeCount = themeElement.findElement(By.name("hits"));
            String count = themeCount.getAttribute("innerHTML");

            assertThat( String.format("Antall stemmer ikke med forventet antall for %s", theme), antall, is(count));
        }
    }
}
