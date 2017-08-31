package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class CatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CatalogController catalogController;

    @Mock
    private PagedResourcesAssembler pagedResourcesAssembler;

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
        String id = "974760673";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);


        try {
            restTemplate.postForObject("/catalogs", catalog, Catalog.class);
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
        Catalog result = restTemplate.withBasicAuth("mgs", "123").postForObject("/catalogs/", catalog, Catalog.class);

        assertThat(result.getId(), is(expectedCatalog.getId()));

        Catalog getResult = restTemplate.getForObject("/catalogs/" + id, Catalog.class);

        assertThat(getResult.getId(), is((expectedCatalog.getId())));
    }

    @Test
    public void listCatalogs() throws Throwable {
        HttpEntity<PagedResources<Catalog>> catalogs =
                catalogController.listCatalogs(new PageRequest(0, 10), pagedResourcesAssembler);
    }

    @Test
    public void createCatalogWithNoIdFails() {
        Catalog catalog = new Catalog();
        catalog.setId(null);
        ResponseEntity<Catalog> actual = (ResponseEntity<Catalog>) catalogController.createCatalog(catalog);

        assertThat(actual.getStatusCode(), is(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void updateCatalogRunsOK() {
        String catalogId = "974760673";
        Map<String, String> title = new HashMap<>();
        title.put("no", "test");

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        catalog.setTitle(title);

        ResponseEntity<Catalog> createdCatalogResponse = (ResponseEntity<Catalog>) catalogController.createCatalog(catalog);

        Catalog createdCatalog = createdCatalogResponse.getBody();

        Map<String, String> title2 = new HashMap<>();
        title2.put("en", "aTest");
        createdCatalog.setTitle(title2);

        ResponseEntity<Catalog> updatedCatalogResponse = (ResponseEntity<Catalog>) catalogController.updateCatalog(catalogId, catalog);

        assertThat(updatedCatalogResponse.getStatusCode(), is(HttpStatus.OK));

        Catalog updatedCatalog = updatedCatalogResponse.getBody();

        assertThat(updatedCatalog.getTitle().get("en"), is("aTest"));

        assertThat(updatedCatalog.getTitle().get("no"), isEmptyOrNullString());

    }

    @Test
    public void deleteCatalogRunsOK() {
        String catalogId = "974760673";
        Map<String, String> title = new HashMap<>();
        title.put("no", "test");

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        catalog.setTitle(title);

        ResponseEntity<Catalog> createdCatalogResponse = (ResponseEntity<Catalog>) catalogController.createCatalog(catalog);

        Catalog createdCatalog = createdCatalogResponse.getBody();

        ResponseEntity<Catalog> deletedCatalogResponse = (ResponseEntity<Catalog>) catalogController.removeCatalog(catalogId);

        assertThat(deletedCatalogResponse.getStatusCode(), is(HttpStatus.OK));


    }
}