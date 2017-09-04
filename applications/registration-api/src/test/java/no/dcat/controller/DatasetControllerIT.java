package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.apache.http.client.ClientProtocolException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by bjg on 01.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class DatasetControllerIT {
    @Autowired
    private TestRestTemplate authorizedRestTemplate;

    private TestRestTemplate unathorizedRestTemplate = new TestRestTemplate();

    private HttpHeaders headers = new HttpHeaders();

    @Before
    public void setup() {
        BasicAuthorizationInterceptor bai = new BasicAuthorizationInterceptor("03096000854", "password01");
        authorizedRestTemplate.getRestTemplate().getInterceptors().add(bai);

        unathorizedRestTemplate.getRestTemplate().setUriTemplateHandler(authorizedRestTemplate.getRestTemplate().getUriTemplateHandler());

        headers.add("Accept", "application/json");
        headers.add("Content-Type", "application/json");
    }

    @Test
    public void elasticsearchIsRunning() throws Exception {
        assertThat(authorizedRestTemplate.getForObject("http://localhost:9200/_cluster/health", String.class), containsString("elasticsearch"));
    }

    @Test
    public void actuatorIsRunning() throws Exception {
        assertThat(authorizedRestTemplate.getForObject("/health", String.class), containsString("UP"));
    }

    @Test
    public void webserviceIsRunning() throws Exception {
        assertThat(authorizedRestTemplate.getForObject("/catalogs", String.class), containsString("/catalogs"));
    }


    @Test
    public void datasetAddedBecomesAvailable() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        Catalog catResult = authorizedRestTemplate
                .postForObject("/catalogs/", catalog, Catalog.class);

        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb",  "Test-tittel");
        dataset.setTitle(languageTitle);

        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalog(catalogId);

        Dataset expectedDataset  = new Dataset(datasetId);
        expectedDataset.setTitle(languageTitle);
        expectedDataset.setDescription(languangeDescription);
        expectedDataset.setCatalog(catalogId);

        Dataset result = authorizedRestTemplate
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);

        datasetId = result.getId();

        assertThat(result.getTitle(), is(dataset.getTitle()));
        assertThat(result.getDescription(), is(dataset.getDescription()));
        assertThat(result.getCatalog(), is(dataset.getCatalog()));

        Dataset getResult = authorizedRestTemplate.getForObject("/catalogs/" + catalogId + "/datasets/" + datasetId, Dataset.class, headers);

        assertThat(getResult, is(result));
    }



    @Test
    public void createDatasetAccessDenied() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        Catalog catResult = authorizedRestTemplate
                .postForObject("/catalogs/", catalog, Catalog.class, headers);

        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);

        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalog(catalogId);

        String datasetUrl = "/catalogs/" + catalogId + "/datasets/";

        //Notice: no authorisation
        HttpEntity<Dataset> postRequest = new HttpEntity<>(dataset, headers);

            ResponseEntity<Dataset> postResponse = unathorizedRestTemplate
                    .withBasicAuth("auser", "apassword")
                    .exchange(datasetUrl, HttpMethod.POST, postRequest, Dataset.class);

            assertThat(postResponse.getStatusCode().value(), is(HttpStatus.UNAUTHORIZED.value()));





    }


    @Test
    public void deleteDatasetAccessDenied() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        Catalog catResult = authorizedRestTemplate
                .postForObject("/catalogs/", catalog, Catalog.class);

        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);

        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalog(catalogId);

        Dataset result = authorizedRestTemplate
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);


        //Notice: no authorisation
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> deleteRequest = new HttpEntity<String>(headers);

        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + result.getId();

        ResponseEntity<String> deleteResponse = unathorizedRestTemplate.exchange(datasetResUrl, HttpMethod.DELETE, deleteRequest, String.class);

        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
    }


    @Test
    public void deleteDatasetSuccess() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "910244132";
        catalog.setId(catalogId);
        Catalog catResult = authorizedRestTemplate
                .postForObject("/catalogs/", catalog, Catalog.class);

        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);

        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalog(catalogId);

        Dataset result = authorizedRestTemplate
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);

        datasetId = result.getId();

        HttpEntity<String> request = new HttpEntity<String>(headers);

        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + result.getId();
        ResponseEntity<String> deleteResponse = authorizedRestTemplate.exchange(datasetResUrl, HttpMethod.DELETE, request, String.class);

        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.OK));

        //Check that dataset is actually gone...
        ResponseEntity<String> getResponse = authorizedRestTemplate.exchange(datasetResUrl, HttpMethod.GET, request, String.class);
        assertThat(getResponse.getStatusCode(), is(HttpStatus.NOT_FOUND));

    }

    @Test
    public void createDatasetInUnknownCatalogFails() throws Throwable {
        Dataset ds = new Dataset();
        ds.setId("444");
        String url = "/catalogs/" + "XX" + "/datasets/";

        HttpEntity<Dataset> request = new HttpEntity<>(ds, headers);

        ResponseEntity<Dataset> result = authorizedRestTemplate.exchange(url, HttpMethod.POST, request, Dataset.class);

        assertThat(result.getStatusCode(), is(HttpStatus.FORBIDDEN));
    }

}
