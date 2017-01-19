package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Created by dask on 22.12.2016.
 */
/**
 * Class for starting cucumbertest for Theme page.
 */
@RunWith(Cucumber.class)
@CucumberOptions(format = { "pretty", "html:target/cucumber" },features = "classpath:feature/gdocKatalog.feature")
public class RunGdocCucumberTest {
}


