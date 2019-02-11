package no.dcat.controller;

import com.google.gson.Gson;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.Catalog;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.admin.DcatSourceDto;
import no.fdk.test.testcategories.IntegrationTest;
import org.apache.commons.codec.binary.Base64;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.*;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@Category(IntegrationTest.class)
@Ignore
public class CatalogControllerIT {
    @ClassRule
    public static ElasticDockerRule elasticRule = new ElasticDockerRule();
    private static Logger logger = LoggerFactory.getLogger(CatalogControllerIT.class);
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private CatalogRepository catalogRepository;
    @Autowired
    private CatalogController catalogController;

    public static String asJsonString(Object obj) {
        return new Gson().toJson(obj);

    }

    @Before
    public void before() {
        catalogRepository.deleteAll();
    }

    @Test
    @WithUserDetails("01066800187")
    public void expectTwoCatalogsWhenSteinLogsIn() throws Exception {
        listCatalogToCreateCatalogs();

        Iterable<Catalog> catalogs = catalogRepository.findAll();

        int count = 0;
        List<String> ids = new ArrayList<>();

        Iterator<Catalog> cats = catalogs.iterator();
        while (cats.hasNext()) {
            Catalog cat = cats.next();
            count++;
            ids.add(cat.getId());
        }
        ids.sort(String::compareTo);

        String[] excpectedIds = {"910244132", "910244999"};

        assertThat(count, is(2));
        assertThat(ids.toArray(), is(excpectedIds));

    }

    @Test
    @WithUserDetails("03096000854")
    public void webserviceIsRunning() throws Exception {
        listCatalogToCreateCatalogs();

    }

    private void listCatalogToCreateCatalogs() throws Exception {
        mockMvc
            .perform(MockMvcRequestBuilders.get("/catalogs", String.class))
            .andExpect(content().string(containsString("/catalogs")));
    }

    @Test
    @WithUserDetails("03096000854")
    public void catalogAddedAndHarvesterDatasourceIsCreated() throws Exception {
        // catalogs are only created when first listed
        listCatalogToCreateCatalogs();

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://localhost:8082/api/admin/dcat-sources";
        logger.debug("harvester uri: {}", uri);

        ResponseEntity<List<DcatSourceDto>> response = null;
        try {
            response = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                new org.springframework.http.HttpEntity<>(createHeaders("test_admin", "password")),
                new ParameterizedTypeReference<List<DcatSourceDto>>() {
                });
        } catch (Exception e) {
            logger.error("Failed to get list of dcat sources from harvester-api: {}", e.getLocalizedMessage());
            logger.error("response from harvester: {}", response.toString());
        }

        logger.debug("response status code: {}", response.getStatusCode());
        List<DcatSourceDto> datasources = response.getBody();

        logger.info("response: {}", response.getBody().size());

        assertTrue(datasources.stream().filter(
            ds -> ds.getId().equals("http://brreg.no/catalogs/910244132")).findFirst().isPresent());

    }

    @Test
    @WithUserDetails("03096000854")
    public void listCatalogs() throws Throwable {

        listCatalogToCreateCatalogs();

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .get("/catalogs")
            )
            .andExpect(content().json("{\n" +
                "  \"_embedded\" : {\n" +
                "    \"catalogs\" : [ {\n" +
                "      \"id\" : \"910244132\",\n" +
                "      \"uri\" : \"http://brreg.no/catalogs/910244132\",\n" +
                "      \"title\" : {\n" +
                "        \"nb\" : \"Datakatalog for RAMSUND OG ROGNAN REVISJON\"\n" +
                "      },\n" +
                "      \"description\" : { },\n" +
                "      \"publisher\" : {\n" +
                "        \"uri\" : \"https://data.brreg.no/enhetsregisteret/api/enheter/910244132\",\n" +
                "        \"name\" : \"RAMSUND OG ROGNAN REVISJON\"\n" +
                "      }\n" +
                "    } ]\n" +
                "  },\n" +
                "  \"_links\" : {\n" +
                "    \"self\" : {\n" +
                "      \"href\" : \"http://localhost/catalogs?page=0&size=20\"\n" +
                "    }\n" +
                "  },\n" +
                "  \"page\" : {\n" +
                "    \"size\" : 20,\n" +
                "    \"totalElements\" : 1,\n" +
                "    \"totalPages\" : 1,\n" +
                "    \"number\" : 0\n" +
                "  }\n" +
                "}"))
            .andExpect(status().isOk());

    }

    @Test
    @WithUserDetails("03096000854")
    public void updateCatalogRunsOK() throws Exception {
        listCatalogToCreateCatalogs();

        Catalog catalog = catalogRepository.findById("910244132").get();

        // change title
        Map<String, String> title2 = new HashMap<>();
        title2.put("en", "aTest");
        catalog.setTitle(title2);

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/catalogs", catalog)
                    .content(asJsonString(catalog))
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://brreg.no/catalogs/910244132\",\"title\":{\"en\":\"aTest\"},\"description\":{},\"publisher\":{\"uri\":\"https://data.brreg.no/enhetsregisteret/api/enheter/910244132\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
            .andExpect(status().isOk());

    }

    @Test
    @WithUserDetails("03096000854")
    public void updateCatalogWithPutRunsOK() throws Exception {
        listCatalogToCreateCatalogs();

        Catalog catalog = catalogRepository.findById("910244132").get();

        // change title
        Map<String, String> title2 = new HashMap<>();
        title2.put("en", "aTest");
        catalog.setTitle(title2);

        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .put("/catalogs/910244132", catalog)
                    .content(asJsonString(catalog))
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://brreg.no/catalogs/910244132\",\"title\":{\"en\":\"aTest\"},\"description\":{},\"publisher\":{\"uri\":\"https://data.brreg.no/enhetsregisteret/api/enheter/910244132\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
            .andExpect(status().isOk());

    }

    @Test
    @WithUserDetails("03096000854")
    public void deleteCatalogRunsOK() throws Exception {
        listCatalogToCreateCatalogs();

        mockMvc
            .perform(MockMvcRequestBuilders.delete("/catalogs/" + "910244132"))
            .andExpect(status().isOk());

    }

    /**
     * helper method to create authorisation header for http request
     *
     * @return HTTP header containing basic auth and content type application/josn
     */
    private HttpHeaders createHeaders(String username, String password) {
        return new HttpHeaders() {{
            String auth = username + ":" + password;

            byte[] encodedAuth = Base64.encodeBase64(
                auth.getBytes(Charset.forName("US-ASCII")));
            String authHeader = "Basic " + new String(encodedAuth);
            set("Authorization", authHeader);
        }};
    }
}
