package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class CatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpHeaders headers = new HttpHeaders();

    @Before
    public void setup() {
        BasicAuthorizationInterceptor bai = new BasicAuthorizationInterceptor("03096000854", "password");
        restTemplate.getRestTemplate().getInterceptors().add(bai);

        headers.add("Accept", "application/json");
    }

    @Test
    public void elasticsearchIsRunning() throws Exception {
        assertThat(restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class), containsString("elasticsearch"));
    }

    @Test
    public void actuatorIsRunning() throws Exception {
        assertThat(restTemplate.getForObject("/health", String.class), containsString("UP"));
    }

    @Test
    public void webserviceIsRunning() throws Exception {
        assertThat(restTemplate
                .getForObject("/catalogs", String.class, headers), containsString("/catalogs"));
    }

    @Test
    public void catalogAddedBecomesAvailable() throws Exception {
        Catalog catalog = new Catalog();
        String id = "910244132";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);

        try {
            restTemplate.postForObject("/catalogs", catalog, Catalog.class, headers);
            //fail("Should fail on authentication");
        } catch (ResourceAccessException rae) {

        }

        Catalog expectedCatalog = new Catalog();
        expectedCatalog.setId(id);
        expectedCatalog.setDescription(description);
        expectedCatalog.setTitle(title);
        Publisher publisher = new Publisher();
        publisher.setId(id);
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/" + id + ".json");
        publisher.setName("REGISTERENHETEN I BRØNNØYSUND");
        expectedCatalog.setPublisher(publisher);

        ResponseEntity<Catalog> response = restTemplate
                .exchange("/catalogs/", HttpMethod.POST, new HttpEntity<Catalog>(catalog), Catalog.class, headers);

        assertThat(response, is(notNullValue()));

        assertThat(response.getStatusCode(), is(HttpStatus.OK));

        Catalog result = response.getBody();

        assertThat(result.getId(), is(expectedCatalog.getId()));

        Catalog getResult = restTemplate
                .getForObject("/catalogs/" + id, Catalog.class);

        assertThat(getResult.getId(), is((expectedCatalog.getId())));
    }
}