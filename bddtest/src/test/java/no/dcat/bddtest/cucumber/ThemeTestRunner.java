package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Class for starting cucumbertest for Theme page.
 */
@RunWith(Cucumber.class)
@CucumberOptions(format = { "pretty", "html:target/cucumber" },features = {"classpath:feature/theme.feature"}
)
public class ThemeTestRunner {
}
