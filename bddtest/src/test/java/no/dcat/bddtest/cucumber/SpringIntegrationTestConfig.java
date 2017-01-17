package no.dcat.bddtest.cucumber;

import no.dcat.bddtest.BddTestApplication;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created by bjg on 03.01.2017.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        classes = BddTestApplication.class,
        loader = SpringApplicationContextLoader.class)
@IntegrationTest
/**
 * Set up test, add Environment variables:
 *  elasticsearch.hostname  192.168.99.100
 *  elasticsearch.port      9300
 *  fdk.hostname            localhost
 *  fdk.port                8081
 */
public class SpringIntegrationTestConfig {
}
