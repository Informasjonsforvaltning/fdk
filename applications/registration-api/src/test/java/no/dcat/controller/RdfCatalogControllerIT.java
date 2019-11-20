package no.dcat.controller;

import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.repository.DatasetRepository;
import no.dcat.service.CatalogRepository;
import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by dask on 20.04.2017.
 */
@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@Category(IntegrationTest.class)
public class RdfCatalogControllerIT {
    @ClassRule
    public static ElasticDockerRule elasticRule = new ElasticDockerRule();
    private static Logger logger = LoggerFactory.getLogger(RdfCatalogControllerIT.class);
    @Autowired
    private DatasetRepository datasetRepository;
    @Autowired
    private RdfCatalogController rdfCatalogController;
    private TestRestTemplate unathorizedRestTemplate = new TestRestTemplate();
    private HttpHeaders headers = new HttpHeaders();
    @Autowired
    private CatalogRepository catalogRepository;

    @Before
    public void before() {
        try {
            catalogRepository.deleteAll();
        } catch (Exception e) {
            logger.debug("catalogRepository was probably empty");
        }

        try {
            datasetRepository.deleteAll();
        } catch (Exception e) {
            logger.debug("datasetRepository was probably empty");
        }
    }

    @Test
    public void catalogExportsOK() throws Exception {
        //
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
//        Catalog result = restTemplate.postForObject("/catalogs/", catalogId, Catalog.class);
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
    }

    @Test
    public void catalogExportsOnlyPublishedDatsets() throws Exception {
        String catId = "123454678";
        Dataset ds1 = new Dataset("ds1");
        ds1.setCatalogId(catId);
        ds1.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
        datasetRepository.save(ds1);

        Dataset ds2 = new Dataset("ds2");
        ds2.setCatalogId(catId);
        ds2.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
        datasetRepository.save(ds2);

        Dataset ds3 = new Dataset("ds3");
        ds3.setCatalogId(catId);
        ds3.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);
        datasetRepository.save(ds3);

        Dataset ds4 = new Dataset("ds4");
        ds4.setCatalogId(catId);
        ds4.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
        datasetRepository.save(ds4);

        Catalog catalog = new Catalog(catId);

        catalogRepository.save(catalog);

        // Do tast

        HttpEntity<Catalog> actual = rdfCatalogController.getCatalog(catId);


        assertThat(actual.getBody().getDataset().size(), is(3));

        assertThat(actual.getBody().getDataset().get(0).getId(), is(containsString("ds1")));

    }


}
