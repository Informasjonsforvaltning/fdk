package no.dcat.bddtest.cucumber;

import no.fdk.test.testcategories.EndToEndTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created by bjg on 03.01.2017.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
/**
 * Set up test, add Environment variables:
 *  elasticsearch.hostname  192.168.99.100
 *  elasticsearch.port      9300
 *  fdk.hostname            localhost
 *  fdk.port                8081
 */
@Category(EndToEndTest.class)
public class SpringIntegrationTestConfigE2E {

    @Test
    public void nothing() {

    }

}
