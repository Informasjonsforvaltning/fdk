package no.dcat.bddtest.cucumber;
import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;


/**
 * Created by bjg on 06.03.2017.
 */
@RunWith(Cucumber.class)
@CucumberOptions(format = "pretty", features = "src/test/resources/feature")
public class CucumberRunner {
}
