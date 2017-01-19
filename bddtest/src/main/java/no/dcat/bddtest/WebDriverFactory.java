package no.dcat.bddtest;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.safari.SafariDriver;

import java.io.File;

/**
 * Created by dask on 19.12.2016.
 */
public class WebDriverFactory {
    public static WebDriver createWebDriver() {
        String webdriver = System.getProperty("browser", "chrome");
        switch(webdriver) {
            case "phantomjs": {
                return new PhantomJSDriver();
            }
            case "firefox": return new FirefoxDriver();
            case "chrome": {
                File file = new File("target/classes/chromedriver.exe");
                System.setProperty("webdriver.chrome.driver", file.getAbsolutePath());

                return new ChromeDriver();
            }
            case "edge": return new EdgeDriver();
            case "safari": return new SafariDriver();
            default:
                throw new RuntimeException("Unsupported webdriver: " + webdriver);
        }
    }
}
