package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Created by dask on 28.02.2017.
 */
@RunWith(Cucumber.class)
@CucumberOptions(strict = true,features = {"classpath:feature/1_FDK-353.feature"})

public class RunHarvesterTest {
}
