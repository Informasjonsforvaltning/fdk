package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.apache.commons.io.Charsets;
import org.apache.commons.ssl.Base64;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.ResourceAccessException;

import java.nio.charset.Charset;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class CatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CatalogController catalogController;

    @Mock
    private PagedResourcesAssembler pagedResourcesAssembler;

    private HttpHeaders headers = new HttpHeaders();

    @Before
    public void setup() {
        BasicAuthorizationInterceptor bai = new BasicAuthorizationInterceptor("03096000854", "password01");
        restTemplate.getRestTemplate().getInterceptors().add(bai);

/*
        String auth = "03096000854:password01";
        byte[] encodedAuth = Base64.encodeBase64(
                auth.getBytes(Charsets.UTF_8) );
        String authHeader = "Basic " + new String( encodedAuth );

*/
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));
        headers.add("Content-Type", "application/json");
  //      headers.add( "Authorization", authHeader );
    }

//    @Test
//    public void elasticsearchIsRunning() throws Exception {
//        assertThat(restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class), containsString("elasticsearch"));
//    }
//
//    @Test
//    public void actuatorIsRunning() throws Exception {
//        assertThat(restTemplate.getForObject("/health", String.class), containsString("UP"));
//    }
//
//    @Test
//    public void webserviceIsRunning() throws Exception {
//        assertThat(restTemplate
//                .getForObject("/catalogs", String.class, headers), containsString("/catalogs"));
//    }
//
//    @Test
//    public void catalogAddedBecomesAvailable() throws Exception {
//        Catalog catalog = new Catalog();
//        String id = "910244132";
//        catalog.setId(id);
//
//        Map<String, String> description = new HashMap<>();
//        description.put("no", "test");
//        catalog.setDescription(description);
//
//        Map<String, String> title = new HashMap<>();
//        title.put("no", "test");
//        catalog.setTitle(title);
//
//        try {
//            restTemplate.postForObject("/catalogs", catalog, Catalog.class, headers);
//            //fail("Should fail on authentication");
//        } catch (ResourceAccessException rae) {
//
//        }
//
//        Catalog expectedCatalog = new Catalog();
//        expectedCatalog.setId(id);
//        expectedCatalog.setDescription(description);
//        expectedCatalog.setTitle(title);
//        Publisher publisher = new Publisher();
//        publisher.setId(id);
//        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/" + id + ".json");
//        publisher.setName("REGISTERENHETEN I BRØNNØYSUND");
//        expectedCatalog.setPublisher(publisher);
//
//        ResponseEntity<Catalog> response = restTemplate
//                .exchange("/catalogs/", HttpMethod.POST, new HttpEntity<Catalog>(catalog), Catalog.class, headers);
//
//        assertThat(response, is(notNullValue()));
//
//        assertThat(response.getStatusCode(), is(HttpStatus.OK));
//
//        Catalog result = response.getBody();
//
//        assertThat(result.getId(), is(expectedCatalog.getId()));
//
//        Catalog getResult = restTemplate
//                .getForObject("/catalogs/" + id, Catalog.class);
//
//        assertThat(getResult.getId(), is((expectedCatalog.getId())));
//    }
//
//    @Test
//    public void listCatalogs() throws Throwable {
//
//       ResponseEntity<PagedResources<Catalog>> catalogPage = restTemplate.exchange("/catalogs", HttpMethod.GET, null, new ParameterizedTypeReference<PagedResources<Catalog>>() {}, headers);
//
//       assertThat(catalogPage.getStatusCode(), is(HttpStatus.OK));
//       assertThat(catalogPage.getBody().getContent().size(), is(1));
//    }
//
//    @Test
//    public void createCatalogWithNoIdFails() {
//        Catalog catalog = new Catalog();
//        catalog.setId(null);
//
//        ResponseEntity<Catalog> actual = restTemplate.exchange("/catalogs", HttpMethod.POST, new HttpEntity<>(catalog), Catalog.class, headers);
//
//        assertThat(actual.getStatusCode(), is(HttpStatus.FORBIDDEN));
//    }
//
//    @Test
//    public void updateCatalogRunsOK() {
//        String catalogId = "910244132";
//        Map<String, String> title = new HashMap<>();
//        title.put("no", "test");
//
//        Catalog catalog = new Catalog();
//        catalog.setId(catalogId);
//        catalog.setTitle(title);
//
//        Catalog createdCatalog = restTemplate.postForObject("/catalogs", catalog, Catalog.class, headers);
//
//        Map<String, String> title2 = new HashMap<>();
//        title2.put("en", "aTest");
//        createdCatalog.setTitle(title2);
//
//        //restTemplate.put("/catalogs/" + catalogId, createdCatalog);
//
//        ResponseEntity<Catalog> updatedCatalogResponse = restTemplate.exchange("/catalogs/"+catalogId, HttpMethod.PUT, new HttpEntity<Catalog>(createdCatalog), Catalog.class, headers);
//
//        assertThat(updatedCatalogResponse.getStatusCode(), is(HttpStatus.OK));
//
//        Catalog updatedCatalog = updatedCatalogResponse.getBody();
//
//        assertThat(updatedCatalog.getTitle().get("en"), is("aTest"));
//
//        assertThat(updatedCatalog.getTitle().get("no"), isEmptyOrNullString());
//
//    }
//
//    @Test
//    public void deleteCatalogRunsOK() {
//        String catalogId = "910244132";
//        Map<String, String> title = new HashMap<>();
//        title.put("no", "test");
//
//        Catalog catalog = new Catalog();
//        catalog.setId(catalogId);
//        catalog.setTitle(title);
//
//        ResponseEntity<Catalog> createdCatalog = restTemplate.exchange("/catalogs", HttpMethod.POST, new HttpEntity<Catalog>(catalog, headers), Catalog.class);
//
//        assertThat(createdCatalog.getStatusCode(), is(HttpStatus.OK));
//
//        ResponseEntity<Catalog> deletedCatalogResponse = restTemplate.exchange("/catalogs/" + catalogId, HttpMethod.DELETE, null, Catalog.class);
//
//        assertThat(deletedCatalogResponse.getStatusCode(), is(HttpStatus.OK));
//
//
//    }
}