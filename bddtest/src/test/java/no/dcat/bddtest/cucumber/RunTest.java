package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 *
 */
@RunWith(Cucumber.class)
@CucumberOptions(format = { "pretty", "html:target/cucumber" },features = "classpath:feature/gdocKatalog.feature"
)

public class RunTest {
}
