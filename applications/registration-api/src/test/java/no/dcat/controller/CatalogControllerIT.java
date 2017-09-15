package no.dcat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.ulisesbocchio.spring.boot.security.saml.annotation.SAMLUser;
import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.bouncycastle.crypto.tls.ContentType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
public class CatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private CatalogController catalogController;

    @Mock
    private PagedResourcesAssembler pagedResourcesAssembler;

    private HttpHeaders headers = new HttpHeaders();


    @Test
    @WithUserDetails( "03096000854")
    public void webserviceIsRunning() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/catalogs", String.class))
                .andExpect(content().string(containsString("/catalogs")));

    }

    @Test
    @WithUserDetails( "03096000854")
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

        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs", catalog)
                                .content(asJsonString(catalog))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://localhost:8099/catalogs/910244132\",\"title\":{\"no\":\"test\"},\"description\":{\"no\":\"test\"},\"publisher\":{\"uri\":\"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
                .andExpect(status().isOk());



    }

    @Test
    @WithUserDetails( "03096000854")
    public void listCatalogs() throws Throwable {

        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .get("/catalogs")
                )
                .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://localhost:8099/catalogs/910244132\",\"title\":{\"no\":\"test\"},\"description\":{\"no\":\"test\"},\"publisher\":{\"uri\":\"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
                .andExpect(status().isOk());


//        ResponseEntity<PagedResources<Catalog>> catalogPage = restTemplate.exchange("/catalogs", HttpMethod.GET, null, new ParameterizedTypeReference<PagedResources<Catalog>>() {
//        }, headers);
//
//        assertThat(catalogPage.getStatusCode(), is(HttpStatus.OK));
//        assertThat(catalogPage.getBody().getContent().size(), is(1));
    }

    @Test
    public void createCatalogWithNoIdFails() {
        Catalog catalog = new Catalog();
        catalog.setId(null);

        ResponseEntity<Catalog> actual = restTemplate.exchange("/catalogs", HttpMethod.POST, new HttpEntity<>(catalog), Catalog.class, headers);

        assertThat(actual.getStatusCode(), is(HttpStatus.FORBIDDEN));
    }


    @Test
    public void updateCatalogRunsOK() {
        String catalogId = "910244132";
        Map<String, String> title = new HashMap<>();
        title.put("no", "test");

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        catalog.setTitle(title);

        Catalog createdCatalog = restTemplate.postForObject("/catalogs", catalog, Catalog.class, headers);

        Map<String, String> title2 = new HashMap<>();
        title2.put("en", "aTest");
        createdCatalog.setTitle(title2);

        //restTemplate.put("/catalogs/" + catalogId, createdCatalog);

        ResponseEntity<Catalog> updatedCatalogResponse = restTemplate.exchange("/catalogs/" + catalogId, HttpMethod.PUT, new HttpEntity<Catalog>(createdCatalog), Catalog.class, headers);

        assertThat(updatedCatalogResponse.getStatusCode(), is(HttpStatus.OK));

        Catalog updatedCatalog = updatedCatalogResponse.getBody();

        assertThat(updatedCatalog.getTitle().get("en"), is("aTest"));

        assertThat(updatedCatalog.getTitle().get("no"), isEmptyOrNullString());

    }

    @Test
    public void deleteCatalogRunsOK() {
        String catalogId = "910244132";
        Map<String, String> title = new HashMap<>();
        title.put("no", "test");

        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        catalog.setTitle(title);

        ResponseEntity<Catalog> createdCatalog = restTemplate.exchange("/catalogs", HttpMethod.POST, new HttpEntity<Catalog>(catalog, headers), Catalog.class);

        assertThat(createdCatalog.getStatusCode(), is(HttpStatus.OK));

        ResponseEntity<Catalog> deletedCatalogResponse = restTemplate.exchange("/catalogs/" + catalogId, HttpMethod.DELETE, null, Catalog.class);

        assertThat(deletedCatalogResponse.getStatusCode(), is(HttpStatus.OK));


    }
    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}