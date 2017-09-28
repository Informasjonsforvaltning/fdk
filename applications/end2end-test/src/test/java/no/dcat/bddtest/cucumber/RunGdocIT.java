package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Created by dask on 22.12.2016.
 * <p>
 * Class for starting cucumbertest for Theme page.
 */

/**
 * Class for starting cucumbertest for Theme page.
 */
@RunWith(Cucumber.class)
@CucumberOptions(
        format = {"pretty", "html:target/cucumber"},
        features = "classpath:feature/GdocCatalog.feature",
        tags = {"~@ignore"}
)

public class RunGdocIT {
}


