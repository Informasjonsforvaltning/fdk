package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.Publisher;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 07.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
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
        String id = "974760673";
        catalog.setId(id);

        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        catalog.setDescription(description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        catalog.setTitle(title);

        Catalog expectedCatalog = new Catalog();
        expectedCatalog.setId(id);
        expectedCatalog.setUri("http://localhost:8099/catalogs/974760673");
        expectedCatalog.setDescription(description);
        expectedCatalog.setTitle(title);
        Publisher publisher = new Publisher();
        publisher.setId(id);
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/" + id + ".json");
        publisher.setName("REGISTERENHETEN I BRØNNØYSUND");
        expectedCatalog.setPublisher(publisher);
        Catalog result = restTemplate.withBasicAuth("mgs", "123").postForObject("/catalogs/", catalog, Catalog.class);

        assertThat(result.getId(), is(notNullValue()));

        Catalog getResult = restTemplate.getForObject("/catalogs/" + id, Catalog.class);

        assertThat(getResult.getId(), is(expectedCatalog.getId()));
    }


    @Given("^user has access to register in the catalog$")
    public void user_has_access_to_register_in_the_catalog() throws Throwable {
        // test that the user has access to register by creating dataset and then deleting it
        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);
        dataset.setCatalog("974760673");

        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/974760673/datasets/", dataset, Dataset.class);

        String datasetUri = "/catalogs/974760673/datasets/" + result.getId();

        restTemplate.withBasicAuth("bjg", "123").delete(datasetUri);
    }



    @Then("^status code HTTP (\\d+) OK is returned$")
    public void status_code_HTTP_Created_is_returned(int arg1) throws Throwable {
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }


}
