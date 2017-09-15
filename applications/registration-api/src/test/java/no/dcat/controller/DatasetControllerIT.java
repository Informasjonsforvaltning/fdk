package no.dcat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import org.apache.http.client.ClientProtocolException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
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
        datasetRepository.deleteAll();;
    }

    @Test
    @WithUserDetails("03096000854")
    public void datasetAddedBecomesAvailable() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs")
                                .content(asJsonString(catalog))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().string("{\"id\":\"910244132\",\"uri\":\"http://brreg.no/catalogs/910244132\",\"title\":{},\"description\":{},\"publisher\":{\"uri\":\"http://data.brreg.no/enhetsregisteret/enhet/910244132.json\",\"id\":\"910244132\",\"name\":\"RAMSUND OG ROGNAN REVISJON\"}}"))
                .andExpect(status().isOk());


        Dataset dataset = new Dataset();

        Map<String, String> languageTitle = new HashMap<>();
        languageTitle.put("nb",  "Test-tittel");
        dataset.setTitle(languageTitle);

        Map<String, String> languangeDescription = new HashMap<>();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);
        

        String datasetResponseJson = mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/catalogs/" + catalogId + "/datasets/")
                                .content(asJsonString(dataset))
                                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.jsonPath("$.catalog").value(catalogId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();


        mockMvc
                .perform(MockMvcRequestBuilders.get("/catalogs/" + catalogId + "/datasets/" + new Gson().fromJson(datasetResponseJson, Dataset.class).getId()))
                .andExpect(status().isOk());



    }

//
//
//    @Test
//    @WithUserDetails("03096000854")
//    public void createDatasetAccessDenied() throws Exception {
//        Catalog catalog = new Catalog();
//        String catalogId = "910244132";
//        catalog.setId(catalogId);
//        Catalog catResult = authorizedRestTemplate
//                .postForObject("/catalogs/", catalog, Catalog.class, headers);
//
//        String datasetId = "101";
//        Dataset dataset = new Dataset(datasetId);
//
//        Map languageTitle = new HashMap();
//        languageTitle.put("nb","Test-tittel");
//        dataset.setTitle(languageTitle);
//
//        Map languangeDescription = new HashMap();
//        languangeDescription.put("nb","test");
//        dataset.setDescription(languangeDescription);
//
//        dataset.setCatalog(catalogId);
//
//        String datasetUrl = "/catalogs/" + catalogId + "/datasets/";
//
//        //Notice: no authorisation
//        HttpEntity<Dataset> postRequest = new HttpEntity<>(dataset, headers);
//
//            ResponseEntity<Dataset> postResponse = unathorizedRestTemplate
//                    .withBasicAuth("auser", "apassword")
//                    .exchange(datasetUrl, HttpMethod.POST, postRequest, Dataset.class);
//
//            assertThat(postResponse.getStatusCode().value(), is(HttpStatus.UNAUTHORIZED.value()));
//
//
//
//
//
//    }
//
//
//    @Test
//    @WithUserDetails("03096000854")
//    public void deleteDatasetAccessDenied() throws Exception {
//        Catalog catalog = new Catalog();
//        String catalogId = "910244132";
//        catalog.setId(catalogId);
//        Catalog catResult = authorizedRestTemplate
//                .postForObject("/catalogs/", catalog, Catalog.class);
//
//        String datasetId = "101";
//        Dataset dataset = new Dataset(datasetId);
//
//        Map languageTitle = new HashMap();
//        languageTitle.put("nb","Test-tittel");
//        dataset.setTitle(languageTitle);
//
//        Map languangeDescription = new HashMap();
//        languangeDescription.put("nb","test");
//        dataset.setDescription(languangeDescription);
//
//        dataset.setCatalog(catalogId);
//
//        Dataset result = authorizedRestTemplate
//                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);
//
//
//        //Notice: no authorisation
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
//        HttpEntity<String> deleteRequest = new HttpEntity<String>(headers);
//
//        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + result.getId();
//
//        ResponseEntity<String> deleteResponse = unathorizedRestTemplate.exchange(datasetResUrl, HttpMethod.DELETE, deleteRequest, String.class);
//
//        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
//    }
//
//
//    @Test
//    @WithUserDetails("03096000854")
//    public void deleteDatasetSuccess() throws Exception {
//        Catalog catalog = new Catalog();
//        String catalogId = "910244132";
//        catalog.setId(catalogId);
//        Catalog catResult = authorizedRestTemplate
//                .postForObject("/catalogs/", catalog, Catalog.class);
//
//        String datasetId = "101";
//        Dataset dataset = new Dataset(datasetId);
//
//        Map languageTitle = new HashMap();
//        languageTitle.put("nb","Test-tittel");
//        dataset.setTitle(languageTitle);
//
//        Map languangeDescription = new HashMap();
//        languangeDescription.put("nb","test");
//        dataset.setDescription(languangeDescription);
//
//        dataset.setCatalog(catalogId);
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

    public static String asJsonString( Object obj) {

        return new Gson().toJson(obj);

    }

}
