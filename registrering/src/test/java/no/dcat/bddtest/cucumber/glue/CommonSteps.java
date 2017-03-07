package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import no.dcat.model.Catalog;
import no.dcat.model.Publisher;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 07.03.2017.
 */
public class CommonSteps extends AbstractSpringCucumberTest {

    @Given("^Elasticsearch is running$")
    public void elasticsearch_is_running() throws Throwable {
        assertThat(restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class), containsString("elasticsearch"));;
    }


    @And("^webservice is running$")
    public void webservice_is_running() throws Throwable {
        assertThat(restTemplate.getForObject("/", String.class), containsString("/catalogs{?page,size,sort}"));
    }


    @And("^a catalog exists$")
    public void a_catalog_exists() throws Throwable {

        Catalog catalog = new Catalog();
        String id = "974760673 ";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);

        Catalog expectedCatalog = new Catalog();
        expectedCatalog.setId(id);
        expectedCatalog.setDescription(description);
        expectedCatalog.setTitle(title);
        Publisher publisher = new Publisher();
        publisher.setId(id);
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/" + id + ".json");
        publisher.setName("REGISTERENHETEN I BRØNNØYSUND");
        expectedCatalog.setPublisher(publisher);
        Catalog result = restTemplate.withBasicAuth("mgs", "123").postForObject("/catalogs/", catalog, Catalog.class);

        assertThat(result, is((expectedCatalog)));

        Catalog getResult = restTemplate.getForObject("/catalogs/" + id, Catalog.class);

        assertThat(getResult, is((expectedCatalog)));
    }
}
