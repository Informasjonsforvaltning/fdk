package no.dcat.controller;

import com.google.gson.Gson;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by bjg on 01.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
public class DatasetControllerIT {
//    @Autowired
//    private TestRestTemplate authorizedRestTemplate;
//
//    private TestRestTemplate unathorizedRestTemplate = new TestRestTemplate();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    @Before
    public void before() {
        catalogRepository.deleteAll();
        datasetRepository.deleteAll();
    }

    @Test
    @WithUserDetails("03096000854")
    public void postCatalogAndDatasetFollowedByGetRequestShouldWork() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs")
                                .content(asJsonString(catalog))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://brreg.no/catalogs/910244132\",\"publisher\":{\"uri\":\"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
                .andExpect(status().isOk());


        Dataset dataset = new Dataset();

        Map<String, String> languageTitle = new HashMap<>();
        languageTitle.put("nb", "Test-tittel");
        dataset.setTitle(languageTitle);

        Map<String, String> languangeDescription = new HashMap<>();
        languangeDescription.put("nb", "test");
        dataset.setDescription(languangeDescription);


        String datasetResponseJson = mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs/" + catalogId + "/datasets/")
                                .content(asJsonString(dataset))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.jsonPath("$.catalogId").value(catalogId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();


        mockMvc
                .perform(MockMvcRequestBuilders.get("/catalogs/" + catalogId + "/datasets/" + new Gson().fromJson(datasetResponseJson, Dataset.class).getId()))
                .andExpect(status().isOk());


    }


    @Test
    public void unauthorizedPostOfDatasetShouldRedirectToLoginPage() throws Exception {


        Dataset dataset = new Dataset("101");

        Map<String, String> languageTitle = new HashMap<>();
        languageTitle.put("nb", "Test-tittel");
        dataset.setTitle(languageTitle);

        Map<String, String> languangeDescription = new HashMap<>();
        languangeDescription.put("nb", "test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalogId("910244132");


        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs/" + dataset.getCatalogId() + "/datasets/")
                                .content(asJsonString(dataset))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(status().is3xxRedirection());

    }


    @Test
    @WithUserDetails("03096000854")
    public void deleteUnknownDatasetShouldResultIn404() throws Exception {

        mockMvc
                .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/datasets/123"))
                .andDo(print())
                .andExpect(status().isNotFound());


    }

    @Test
    public void deleteDatasetWithoutUserShouldGiveRedirectToLogin() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.delete("/catalogs/910244132/datasets/123"))
                .andDo(print())
                .andExpect(status().is3xxRedirection());
    }


//  @Test
//  public void createADatasetAndTryToDeleteItWithAnotherUser(){
//        //@TODO
//  }

//
//    @Test
//    @WithUserDetails("03096000854")
//    public void deleteDatasetSuccess() throws Exception {
//        Catalog catalogId = new Catalog();
//        String catalogId = "910244132";
//        catalogId.setId(catalogId);
//        Catalog catResult = authorizedRestTemplate
//                .postForObject("/catalogs/", catalogId, Catalog.class);
//
//        String datasetId = "101";
//        Dataset dataset = new Dataset(datasetId);
//
//        Map<String, String> languageTitle = new HashMap<>();
//        languageTitle.put("nb","Test-tittel");
//        dataset.setTitle(languageTitle);
//
//        Map<String, String> languangeDescription = new HashMap<>();
//        languangeDescription.put("nb","test");
//        dataset.setDescription(languangeDescription);
//
//        dataset.setCatalogId(catalogId);
//
//        Dataset result = authorizedRestTemplate
//                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);
//
//        datasetId = result.getId();
//
//        HttpEntity<String> request = new HttpEntity<String>(headers);
//
//        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + result.getId();
//        ResponseEntity<String> deleteResponse = authorizedRestTemplate.exchange(datasetResUrl, HttpMethod.DELETE, request, String.class);
//
//        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.OK));
//
//        //Check that dataset is actually gone...
//        ResponseEntity<String> getResponse = authorizedRestTemplate.exchange(datasetResUrl, HttpMethod.GET, request, String.class);
//        assertThat(getResponse.getStatusCode(), is(HttpStatus.NOT_FOUND));
//
//    }
//
//    @Test
//    @WithUserDetails("03096000854")
//    public void createDatasetInUnknownCatalogFails() throws Throwable {
//        Dataset ds = new Dataset();
//        ds.setId("444");
//        String url = "/catalogs/" + "XX" + "/datasets/";
//
//        HttpEntity<Dataset> request = new HttpEntity<>(ds, headers);
//
//        ResponseEntity<Dataset> result = authorizedRestTemplate.exchange(url, HttpMethod.POST, request, Dataset.class);
//
//        assertThat(result.getStatusCode(), is(HttpStatus.FORBIDDEN));
//    }

    public static String asJsonString(Object obj) {

        return new Gson().toJson(obj);

    }

}
