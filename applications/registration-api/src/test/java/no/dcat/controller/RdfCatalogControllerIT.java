package no.dcat.controller;

import no.dcat.RegisterApplication;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import org.junit.Before;
import no.dcat.service.DatasetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthorizationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by dask on 20.04.2017.
 */
@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class RdfCatalogControllerIT {
//
//    @Autowired
//    private TestRestTemplate restTemplate;
//
//    @Autowired
//    private DatasetRepository datasetRepository;
//
//    @Autowired
//    private CatalogRepository catalogRepository;
//
//    @Autowired
//    private RdfCatalogController rdfCatalogController;
//
//    private TestRestTemplate unathorizedRestTemplate = new TestRestTemplate();
//
//    private HttpHeaders headers = new HttpHeaders();
//
//    @Before
//    public void setup() {
//        BasicAuthorizationInterceptor bai = new BasicAuthorizationInterceptor("03096000854", "password01");
//        restTemplate.getRestTemplate().getInterceptors().add(bai);
//
//        headers.add("Accept", "application/json");
//        headers.add("Content-Type", "application/json");
//    }
//
//    @Test
//    public void catalogExportsOK() throws Exception {
//        //
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
//        Catalog result = restTemplate.postForObject("/catalogs/", catalog, Catalog.class);
//
//        assertNotNull(result.getId());
//
//        Catalog resultget = restTemplate.getForObject("/catalogs/" + catalog.getId(), Catalog.class);
//
//        String catalogUrl = "/catalogs/" + resultget.getId();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Accept", "text/turtle");
//        HttpEntity<String> request2 = new HttpEntity<String>(headers);
//
//        ResponseEntity<String> actualDcat = restTemplate.exchange(catalogUrl, HttpMethod.GET, request2, String.class);
//
//        assertThat(actualDcat.getBody(), is(containsString("@prefix dcat:  <http://www.w3.org/ns/dcat#>")));
//    }
//
//    @Test
//    public void catalogExportsOnlyPublishedDatsets() throws Exception {
//        String catId = "123454678";
//        Dataset ds1 = new Dataset("ds1");
//        ds1.setCatalog(catId);
//        ds1.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
//        datasetRepository.save(ds1);
//
//        Dataset ds2 = new Dataset("ds2");
//        ds2.setCatalog(catId);
//        ds2.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
//        datasetRepository.save(ds2);
//
//        Dataset ds3 = new Dataset("ds3");
//        ds3.setCatalog(catId);
//        ds3.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);
//        datasetRepository.save(ds3);
//
//        Dataset ds4 = new Dataset("ds4");
//        ds4.setCatalog(catId);
//        ds4.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
//        datasetRepository.save(ds4);
//
//        Catalog catalog = new Catalog(catId);
//
//        catalogRepository.save(catalog);
//
//        // Do tast
//
//        HttpEntity<Catalog> actual = rdfCatalogController.getCatalog(catId);
//
//
//        assertThat(actual.getBody().getDataset().size(), is(3));
//
//        assertThat(actual.getBody().getDataset().get(0).getId(), is(containsString("ds1")));
//
//    }


    @Test
    public void emptyTest(){}

}
