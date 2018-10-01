package no.dcat.controller;

import com.google.gson.Gson;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiCatService;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.IntegrationTest;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
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

    @ClassRule
    public static ElasticDockerRule elasticRule = new ElasticDockerRule();
    private static Logger logger = LoggerFactory.getLogger(ApiRegistrationControllerIT.class);
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private CatalogRepository catalogRepository;
    @Autowired
    private ApiRegistrationRepository apiRegistrationRepository;


    @Mock
    private ApiRegistrationRepository mockApiRegistrationRepository;

    @Mock
    private ApiCatService mockApiCatService;

    @Mock
    private ApiCatClient mockApiCatClient;

    @Mock
    private CatalogRepository mockCatalogRepository;


    @InjectMocks
    private ApiRegistrationController apiRegistrationController;

    public static String asJsonString(Object obj) {
        return new Gson().toJson(obj);
    }

    @Before
    public void before() {
        MockitoAnnotations.initMocks(this);

        String catalogId = "1234";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);

        when(mockCatalogRepository.findById(anyString())).thenReturn(Optional.of(catalog));
        when(mockApiCatClient.convert(anyString(), anyString())).thenReturn(null);
        when(mockApiCatService.getClient()).thenReturn(mockApiCatClient);
        apiRegistrationController =
                new ApiRegistrationController(mockApiRegistrationRepository, mockCatalogRepository, mockApiCatService);

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

        apiRegistration.setPrice("100 kr.");
        apiRegistration.setApiSpec(
                "{\n" +
                        "  \"openapi\": \"3.0.0\",\n" +
                        "  \"servers\": [\n" +
                        "    {\n" +
                        "      \"url\": \"https://data.brreg.no/enhetsregisteret/api\",\n" +
                        "      \"description\": \"Produksjon\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"info\": {\n" +
                        "    \"description\": \"Teknisk beskrivelse av REST-tjenestene\",\n" +
                        "    \"version\": \"1.0.0\",\n" +
                        "    \"title\": \"Åpne Data fra Enhetsregisteret - API Dokumentasjon\",\n" +
                        "    \"contact\": {\n" +
                        "      \"name\": \"Forenkling og Brukerdialog hos Brønnøysundregistrene\",\n" +
                        "      \"email\": \"opendata@brreg.no\"\n" +
                        "    },\n" +
                        "    \"license\": {\n" +
                        "      \"name\": \"Norsk lisens for offentlige data (NLOD)\",\n" +
                        "      \"url\": \"https://data.norge.no/nlod/no/\"\n" +
                        "    }\n" +
                        "  },\n" +
                        "  \"paths\": {\n" +
                        "    \"/\": {\n" +
                        "      \"get\": {\n" +
                        "        \"operationId\": \"listTjenester\",\n" +
                        "        \"description\": \"Hent alle tjenester\",\n" +
                        "        \"responses\": {\n" +
                        "          \"200\": {\n" +
                        "            \"description\": \"Tjenester mot åpne data fra Enhetsregisteret\"\n" +
                        "          },\n" +
                        "          \"default\": {\n" +
                        "            \"description\": \"Udefinert feil\"\n" +
                        "          }\n" +
                        "        }\n" +
                        "      }\n" +
                        "    }\n" +
                        "  }\n" +
                        "}");


        String apiResponseJson =
                mockMvc
                        .perform(
                                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apis/")
                                        .content(asJsonString(apiRegistration))
                                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                        .andDo(print())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.price").value("100 kr."))
                        .andExpect(status().isOk())
                        .andReturn()
                        .getResponse()
                        .getContentAsString();

        mockMvc
                .perform(
                        MockMvcRequestBuilders.get(
                                "/catalogs/"
                                        + catalogId
                                        + "/apis/"
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
                        MockMvcRequestBuilders.get("/catalogs/" + catalogId + "/apis")
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(
                        MockMvcResultMatchers.jsonPath("$._embedded.apiRegistrations[*].price")
                                .value("100 kr."))
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

        apiRegistration.setPrice("100 kr.");

        String apiRegistrationResponseJson =
                mockMvc
                        .perform(
                                MockMvcRequestBuilders.post("/catalogs/" + catalogId + "/apis/")
                                        .content(asJsonString(apiRegistration))
                                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                        .andDo(print())
                        .andExpect(MockMvcResultMatchers.jsonPath("$.price").value("100 kr."))
                        .andExpect(status().isOk())
                        .andReturn()
                        .getResponse()
                        .getContentAsString();

        return new Gson().fromJson(apiRegistrationResponseJson, ApiRegistration.class).getId();
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
                        MockMvcRequestBuilders.delete("/catalogs/" + catalogId + "/apis/" + apiRegistrationId)
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails("03096000854")
    public void deleteUnknownApiRegistrationShouldResultIn404() throws Exception {

        mockMvc
                .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apis/123"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void deleteApiRegistrationWithoutUserShouldGiveRedirectToLogin() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/apis/123"))
                .andDo(print())
                .andExpect(status().is3xxRedirection());
    }
}
