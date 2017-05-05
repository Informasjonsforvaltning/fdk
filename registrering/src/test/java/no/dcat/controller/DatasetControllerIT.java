package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
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
    private TestRestTemplate restTemplate;

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
    public void datasetAddedBecomesAvailable() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "974760673";
        catalog.setId(catalogId);
        Catalog catResult = restTemplate.withBasicAuth("bjg", "123")
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


        Dataset expectedDataset  = new Dataset(datasetId);
        expectedDataset.setTitle(languageTitle);
        expectedDataset.setDescription(languangeDescription);
        expectedDataset.setCatalog(catalogId);

        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);

        datasetId = result.getId();

        assertThat(result.getTitle(), is(dataset.getTitle()));
        assertThat(result.getDescription(), is(dataset.getDescription()));
        assertThat(result.getCatalog(), is(dataset.getCatalog()));

        Dataset getResult = restTemplate.getForObject("/catalogs/" + catalogId + "/datasets/" + datasetId, Dataset.class);

        assertThat(getResult, is(result));
    }



    @Test
    public void createDatasetAccessDenied() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "974760673";
        catalog.setId(catalogId);
        Catalog catResult = restTemplate.withBasicAuth("bjg", "123")
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

        String datasetUrl = "/catalogs/" + catalogId + "/datasets/";

        //Notice: no authorisation
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> postRequest = new HttpEntity<String>(headers);

        ResponseEntity<Dataset> postResponse = restTemplate.exchange(datasetUrl, HttpMethod.POST, postRequest, Dataset.class);
        assertThat(postResponse.getStatusCode().value(), is(HttpStatus.UNAUTHORIZED.value()));
    }


    @Test
    public void deleteDatasetAccessDenied() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "974760673";
        catalog.setId(catalogId);
        Catalog catResult = restTemplate.withBasicAuth("bjg", "123")
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

        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);


        //Notice: no authorisation
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> deleteRequest = new HttpEntity<String>(headers);

        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + datasetId;
        ResponseEntity<String> deleteResponse = restTemplate.exchange(datasetResUrl, HttpMethod.DELETE, deleteRequest, String.class);

        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
    }


    @Test
    public void deleteDatasetSuccess() throws Exception {
        Catalog catalog = new Catalog();
        String catalogId = "974760673";
        catalog.setId(catalogId);
        Catalog catResult = restTemplate.withBasicAuth("bjg", "123")
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

        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);

        datasetId = result.getId();

        HttpHeaders headers = createHeaders("bjg","123");
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> request = new HttpEntity<String>(headers);

        String datasetResUrl = "/catalogs/" + catalogId + "/datasets/" + datasetId;
        ResponseEntity<String> deleteResponse = restTemplate.exchange(datasetResUrl, HttpMethod.DELETE, request, String.class);

        assertThat(deleteResponse.getStatusCode(), is(HttpStatus.OK));

        //Check that dataset is actually gone...
        ResponseEntity<String> getResponse = restTemplate.exchange(datasetResUrl, HttpMethod.GET, request, String.class);
        assertThat(getResponse.getStatusCode(), is(HttpStatus.NOT_FOUND));

    }

    @Test
    public void createDatasetInUnknownCatalogFails() throws Throwable {
        Dataset ds = new Dataset();
        ds.setId("444");
        HttpHeaders headers = createHeaders("bjg","123");
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        String url = "/catalogs/" + "XX" + "/datasets/";

        HttpEntity<Dataset> request = new HttpEntity<>(ds, headers);
        ResponseEntity<Dataset> result = restTemplate.exchange(url, HttpMethod.POST, request, Dataset.class);

        Dataset actual = result.getBody();

        assertThat(result.getStatusCode(), is(HttpStatus.NOT_FOUND));
        assertThat(actual.getId(), is(nullValue()));

    }


    static HttpHeaders createHeaders(String username, String password){
        return new HttpHeaders() {{
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(
                    auth.getBytes(Charset.forName("US-ASCII")) );
            String authHeader = "Basic " + new String( encodedAuth );
            set( "Authorization", authHeader );
        }};
    }

}
