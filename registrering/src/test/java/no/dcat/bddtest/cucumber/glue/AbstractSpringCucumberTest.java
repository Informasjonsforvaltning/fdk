package no.dcat.bddtest.cucumber.glue;

import no.dcat.RegisterApplication;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.nio.charset.Charset;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by bjg on 07.03.2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RegisterApplication.class, webEnvironment = RANDOM_PORT)
@ContextConfiguration
@Ignore
public abstract class AbstractSpringCucumberTest {

    protected static ResponseEntity<String> response;

    @Autowired
    protected TestRestTemplate restTemplate;

    /**
     * Helper method to set up http headers
     * @param username
     * @param password
     * @return http header with basic authorisation
     */
    HttpHeaders createHeaders(String username, String password){
        return new HttpHeaders() {{
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(Charset.forName("US-ASCII")) );
            String authHeader = "Basic " + new String( encodedAuth );
            set( "Authorization", authHeader );
        }};
    }
}
