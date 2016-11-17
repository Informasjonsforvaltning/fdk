package no.dcat.portal.query;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.*;

/**
 * Created by nodavsko on 13.10.2016.
 */

@RunWith(SpringRunner.class)
//@EnableConfigurationProperties
//@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SimpleQueryServiceTest {
    private static Logger logger = LoggerFactory.getLogger(SimpleQueryServiceTest.class);

    //@Autowired
    //private TestRestTemplate restTemplate;

    /* TODO This is an integration test, move ...
    @Test
    public void apiFailsWithoutConfiguredDatabase () {
        SimpleQueryService sqs = new SimpleQueryService();
        sqs.setElasticsearchHost("");

        ResponseEntity<String> actual =  sqs.search("", 0, 10);

        logger.info(actual.getBody());
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
    } */

    @Test
    public void return400IfFromIsBelowZero() {
        SimpleQueryService sqs = new SimpleQueryService();
        ResponseEntity<String> actual =  sqs.search("", -10, 1000, "nb", "", "");

        logger.info(actual.getBody());
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void return400IfSizeIsLargerThan100() {
        SimpleQueryService sqs = new SimpleQueryService();
        ResponseEntity<String> actual =  sqs.search("", 10, 101, "nb", "", "");

        logger.info(actual.getBody());
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }
}
