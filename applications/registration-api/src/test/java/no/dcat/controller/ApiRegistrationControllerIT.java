package no.dcat.controller;

import com.google.gson.Gson;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiRegistrationRepository;
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
public class ApiRegistrationControllerIT {

  @ClassRule public static ElasticDockerRule elasticRule = new ElasticDockerRule();
  private static Logger logger = LoggerFactory.getLogger(ApiRegistrationControllerIT.class);
  @Autowired private MockMvc mockMvc;
  @Autowired private CatalogRepository catalogRepository;
  @Autowired private ApiRegistrationRepository apiRegistrationRepository;
  
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
      apiRegistrationRepository.deleteAll();
    } catch (Exception e) {
      logger.debug("apiRegistrationRepository was probably empty");
    }
  }

  @Test
  @WithUserDetails("01066800187")
  public void postApiRegistration() throws Exception {

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

    ApiRegistration apiRegistration = new ApiRegistration();

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("api", "Test-tittel");
    apiRegistration.setTitle(languageTitle);

    Map<String, String> languangeDescription = new HashMap<>();
    languangeDescription.put("api", "Test-beskrivelse");
    apiRegistration.setDescription(languangeDescription);

    String apiResponseJson =
        mockMvc
            .perform(
                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apispecs/")
                    .content(asJsonString(apiRegistration))
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
                    + new Gson().fromJson(apiResponseJson, ApiRegistration.class).getId()))
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void listApiRegistrationShouldWork() throws Exception {

    // setup test data
    String catalogId = "910244132";
    String apiRegistrationId = createCatalogAndSimpleApiRegistration(catalogId);

    // get all apiRegistrationId in catalog
    mockMvc
        .perform(
            MockMvcRequestBuilders.get("/catalogs/" + catalogId + "/apispecs")
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$._embedded.apiRegistrations[*].title.nb")
                .value("Test-tittel"))
        .andExpect(status().isOk());
  }

  /**
   * Helper function to create a catalog and simple apiRegistration to be used in tests
   *
   * @param catalogId id of catalog to be created
   * @return id of created apiRegistration
   */
  public String createCatalogAndSimpleApiRegistration(String catalogId) throws Exception {
    Catalog catalog = new Catalog();
    catalog.setId(catalogId);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post("/catalogs")
                .content(asJsonString(catalog))
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());

    // create apiRegistration to be changed later
    ApiRegistration apiRegistration = new ApiRegistration();

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("nb", "Test-tittel");
    apiRegistration.setTitle(languageTitle);

    Map<String, String> languangeDescription = new HashMap<>();
    languangeDescription.put("nb", "test");
    apiRegistration.setDescription(languangeDescription);

    String apiRegistrationResponseJson =
        mockMvc
            .perform(
                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apispecs/")
                    .content(asJsonString(apiRegistration))
                    .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andDo(print())
            .andExpect(MockMvcResultMatchers.jsonPath("$.title.nb").value("Test-tittel"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    return new Gson().fromJson(apiRegistrationResponseJson, ApiRegistration.class).getId();
  }

  @Test
  @WithUserDetails("03096000854")
  public void putApiRegistrationShouldWork() throws Exception {

    // setup test data
    String orgNr = "910244132";
    String apiRegistrationId = createCatalogAndSimpleApiRegistration(orgNr);

    // create a modified apiRegistration to replace the existing one
    ApiRegistration apiRegistration = new ApiRegistration(apiRegistrationId);

    Map<String, String> languageTitle = new HashMap<>();
    languageTitle.put("nb", "Oppdatert tittel");
    apiRegistration.setTitle(languageTitle);

    apiRegistration.setOrgNr(orgNr);

    // save the new apiRegistration in place of the old one
    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/catalogs/" + orgNr + "/apispecs/" + apiRegistrationId)
                .content(asJsonString(apiRegistration))
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(MockMvcResultMatchers.jsonPath("$.title.nb").value("Oppdatert tittel"))
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void deleteApiRegistrationsShouldWork() throws Exception {

    // setup test data
    String catalogId = "910244132";
    String apiRegistrationId = createCatalogAndSimpleApiRegistration(catalogId);

    // delete apiRegistration
    mockMvc
        .perform(
            MockMvcRequestBuilders.delete(
                    "/catalogs/" + catalogId + "/apispecs/" + apiRegistrationId)
                .contentType(MediaType.APPLICATION_JSON_UTF8))
        .andDo(print())
        .andExpect(status().isOk());
  }

  @Test
  @WithUserDetails("03096000854")
  public void deleteUnknownApiRegistrationShouldResultIn404() throws Exception {

    mockMvc
        .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apispecs/123"))
        .andDo(print())
        .andExpect(status().isNotFound());
  }

  @Test
  public void deleteApiRegistrationWithoutUserShouldGiveRedirectToLogin() throws Exception {
    mockMvc
        .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apispecs/123"))
        .andDo(print())
        .andExpect(status().is3xxRedirection());
  }
}
