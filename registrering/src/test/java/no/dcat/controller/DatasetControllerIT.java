package no.dcat.controller;

import no.dcat.factory.DatasetFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.Publisher;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
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

        assertThat(result, is(expectedDataset));

        Dataset getResult = restTemplate.getForObject("/catalogs/" + catalogId + "/datasets/" + datasetId, Dataset.class);

        assertThat(getResult, is((expectedDataset)));
    }

}
