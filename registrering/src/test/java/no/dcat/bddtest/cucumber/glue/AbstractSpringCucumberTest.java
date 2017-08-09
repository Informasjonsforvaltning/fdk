package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.Before;
import no.dcat.RegisterApplication;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.PostConstruct;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by bjg on 07.03.2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RegisterApplication.class, webEnvironment = RANDOM_PORT)
@ContextConfiguration
@Ignore
@ActiveProfiles(value = "unit-integration")
public abstract class AbstractSpringCucumberTest {

    protected static ResponseEntity<String> response;
    protected static List<RuntimeException> exceptions = new ArrayList<>();

    @Autowired
    protected TestRestTemplate restTemplate;

    protected HttpHeaders headers = new HttpHeaders();

    @PostConstruct
    public void setup() {
        BasicAuthorizationInterceptor bai = new BasicAuthorizationInterceptor("01066800187", "password");
        restTemplate.getRestTemplate().getInterceptors().add(bai);

        headers.add("Accept", "application/json");
    }

    public String getCatalogId() {
        return "910244132";
    }

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
