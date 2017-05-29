package no.dcat.controller;

import no.dcat.RegisterApplication;
import no.dcat.model.Catalog;
import no.dcat.service.CatalogRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by dask on 20.04.2017.
 */
@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = RegisterApplication.class)
public class RdfCatalogControllerIT {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void catalogExportsOK() throws Exception {
        //
        Catalog catalog = new Catalog();
        String id = "974760673 ";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);

        Catalog result = restTemplate.withBasicAuth("mgs", "123").postForObject("/catalogs/", catalog, Catalog.class);

        if (result.getId() == null) {
            fail();
        }

        Catalog resultget = restTemplate.withBasicAuth("mgs", "123").getForObject("/catalogs/" + catalog.getId(), Catalog.class);

        String catalogUrl = "/catalogs/" + resultget.getId();

        HttpHeaders headers = DatasetControllerIT.createHeaders("bjg","123");
        headers.add("Accept", "text/turtle");
        HttpEntity<String> request2 = new HttpEntity<String>(headers);

        ResponseEntity<String> actualDcat = restTemplate.exchange(catalogUrl, HttpMethod.GET, request2, String.class);

        assertThat(actualDcat.getBody(), is(containsString("@prefix dcat:  <http://www.w3.org/ns/dcat#>")));
    }


}
