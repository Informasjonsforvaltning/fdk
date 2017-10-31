package no.dcat.portal.query;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class RdfExportIT {
    private static Logger logger = LoggerFactory.getLogger(RdfExportIT.class);

    @Autowired
    TestRestTemplate template;

    @Test
    public void testRdf() throws Throwable {
        HttpHeaders headers = new HttpHeaders();

        headers.add("Accept", "text/turtle");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = template.exchange("/datasets/http%3A%2F%2Fbrreg.no%2Fcatalogs%2F974760673%2Fdatasets%2F59eb9ae3-6bc3-4906-a87e-ee530c1273ed",
                HttpMethod.GET, entity, String.class);

        logger.debug(response.getBody());


    }
}
