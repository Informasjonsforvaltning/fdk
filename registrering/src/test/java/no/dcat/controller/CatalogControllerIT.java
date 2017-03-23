package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class CatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

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
        assertThat(restTemplate.getForObject("/", String.class), containsString("/catalogs{?page,size,sort}"));
    }

    @Test
    public void catalogAddedBecomesAvailable() throws Exception {
        Catalog catalog = new Catalog();
        String id = "974760673 ";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);


        try {
            restTemplate.postForObject("/catalogs", catalog, Catalog.class);
            fail("Should fail on authentication");
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
        Catalog result = restTemplate.withBasicAuth("mgs", "123").postForObject("/catalogs/", catalog, Catalog.class);

        assertThat(result, is((expectedCatalog)));

        Catalog getResult = restTemplate.getForObject("/catalogs/" + id, Catalog.class);

        assertThat(getResult, is((expectedCatalog)));
    }
}