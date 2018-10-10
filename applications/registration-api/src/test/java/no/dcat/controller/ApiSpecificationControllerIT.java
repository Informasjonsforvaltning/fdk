package no.dcat.controller;

import com.google.gson.Gson;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.ApiSpecification;
import no.dcat.model.Catalog;
import no.dcat.service.ApiSpecificationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.IntegrationTest;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@Category(IntegrationTest.class)
public class ApiSpecificationControllerIT {

  @ClassRule public static ElasticDockerRule elasticRule = new ElasticDockerRule();
  private static Logger logger = LoggerFactory.getLogger(ApiSpecificationControllerIT.class);
  private ApiSpecificationController apiSpecificationController;
  @Mock private ApiSpecificationRepository mockApiSpecificationRepository;
  @Autowired private MockMvc mockMvc;
  @Autowired private CatalogRepository catalogRepository;
  @Autowired private ApiSpecificationRepository apiSpecificationRepository;
  private HttpHeaders headers = new HttpHeaders();

  public static String asJsonString(Object obj) {
    return new Gson().toJson(obj);
  }

  @Before
  public void before() {
    try {
      catalogRepository.deleteAll();
    } catch (Exception e) {
      logger.debug("catalogRepository was probably empty");
    }

    try {
      apiSpecificationRepository.deleteAll();
    } catch (Exception e) {
      logger.debug("apiSpecificationRepository was probably empty");
    }
  }

  @Test
  @WithUserDetails("01066800187")
  public void postApiSpecification() throws Exception {

    Catalog catalog = new Catalog();
    String catalogId = "910244999";
    catalog.setId(catalogId);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/catalogs")
                .content(asJsonString(catalog))
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(
            content()
                .string(
                    "{\"id\":\"910244999\",\"uri\":\"http://brreg.no/catalogs/910244999\",\"title\":{},\"description\":{},\"publisher\":{\"uri\":\"https://data.brreg.no/enhetsregisteret/api/enheter/910244999\",\"id\":\"910244999\",\"name\":\"UTOPIA REVISJON\"}}"))
        .andExpect(status().isOk());

    ApiSpecification apiSpecification = new ApiSpecification();

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("api", "Test-tittel");
    apiSpecification.setTitle(languageTitle);

    Map<String, String> languangeDescription = new HashMap<>();
    languangeDescription.put("api", "Test-beskrivelse");
    apiSpecification.setDescription(languangeDescription);

    String apiResponseJson =
        mockMvc
            .perform(
                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apispecs/")
                    .content(asJsonString(apiSpecification))
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andDo(print())
            .andExpect(MockMvcResultMatchers.jsonPath("$.title.api").value("Test-tittel"))
            .andExpect(
                MockMvcResultMatchers.jsonPath("$.description.api").value("Test-beskrivelse"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    mockMvc
        .perform(
            MockMvcRequestBuilders.get(
                "/catalogs/"
                    + catalogId
                    + "/apispecs/"
                    + new Gson().fromJson(apiResponseJson, ApiSpecification.class).getId()))
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void listApiSpecificationShouldWork() throws Exception {

    // setup test data
    String catalogId = "910244132";
    String apiSpecificationId = createCatalogAndSimpleApiSpecification(catalogId);

    // get all apiSpecificationId in catalog
    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/catalogs/" + catalogId + "/apispecs")
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$._embedded.apiSpecifications[*].title.nb")
                .value("Test-tittel"))
        .andExpect(status().isOk());
  }

  /**
   * Helper function to create a catalog and simple apiSpecification to be used in tests
   *
   * @param catalogId id of catalog to be created
   * @return id of created apiSpecification
   */
  public String createCatalogAndSimpleApiSpecification(String catalogId) throws Exception {
    Catalog catalog = new Catalog();
    catalog.setId(catalogId);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/catalogs")
                .content(asJsonString(catalog))
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());

    // create apiSpecification to be changed later
    ApiSpecification apiSpecification = new ApiSpecification();

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("nb", "Test-tittel");
    apiSpecification.setTitle(languageTitle);

    Map<String, String> languangeDescription = new HashMap<>();
    languangeDescription.put("nb", "test");
    apiSpecification.setDescription(languangeDescription);

    String apiSpecificationResponseJson =
        mockMvc
            .perform(
                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apispecs/")
                    .content(asJsonString(apiSpecification))
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andDo(print())
            .andExpect(MockMvcResultMatchers.jsonPath("$.title.nb").value("Test-tittel"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    return new Gson().fromJson(apiSpecificationResponseJson, ApiSpecification.class).getId();
  }

  @Test
  @WithUserDetails("03096000854")
  public void putApiSpecificationShouldWork() throws Exception {

    // setup test data
    String catalogId = "910244132";
    String apiSpecificationId = createCatalogAndSimpleApiSpecification(catalogId);

    // create a modified apiSpecification to replace the existing one
    ApiSpecification apiSpecification = new ApiSpecification(apiSpecificationId);

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("nb", "Oppdatert tittel");
    apiSpecification.setTitle(languageTitle);

    apiSpecification.setCatalogId(catalogId);

    // save the new apiSpecification in place of the old one
    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/catalogs/" + catalogId + "/apispecs/" + apiSpecificationId)
                .content(asJsonString(apiSpecification))
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.jsonPath("$.title.nb").value("Oppdatert tittel"))
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void deleteApiSpecificationsShouldWork() throws Exception {

    // setup test data
    String catalogId = "910244132";
    String apiSpecificationId = createCatalogAndSimpleApiSpecification(catalogId);

    // delete apiSpecification
    mockMvc
        .perform(
            MockMvcRequestBuilders.delete(
                    "/catalogs/" + catalogId + "/apispecs/" + apiSpecificationId)
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void deleteUnknownApiSpecificationShouldResultIn404() throws Exception {

    mockMvc
        .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apispecs/123"))
        .andDo(print())
        .andExpect(status().isNotFound());
  }

  @Test
  public void deleteApiSpecificationWithoutUserShouldGiveRedirectToLogin() throws Exception {
    mockMvc
        .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apispecs/123"))
        .andDo(print())
        .andExpect(status().is3xxRedirection());
  }
}
