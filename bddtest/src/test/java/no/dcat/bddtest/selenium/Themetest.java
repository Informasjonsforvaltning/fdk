package no.dcat.bddtest.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;

/**
 *
 */
public class Themetest {
    public static void main(String[] args) {

        File file = new File("C:/development/fdk/bddtest/src/main/resources/IEDriverServer.exe");
        System.setProperty("webdriver.ie.driver", file.getAbsolutePath());

        DesiredCapabilities caps = DesiredCapabilities.internetExplorer();
        caps.setCapability("ignoreZoomSetting", true);

        WebDriver driver = new InternetExplorerDriver(caps);

        driver.get("http://localhost:8081/");

        WebElement element = driver.findElement(By.id("Befolkning og samfunn"));

        element.click();

        //element.sendKeys("enhet");
        //element.submit();

        System.out.print("hit.." + driver.getTitle());
        driver.quit();
    }
}
