package no.dcat.bddtest.cucumber.glue;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import cucumber.api.junit.Cucumber;
import no.dcat.RegisterApplication;
import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import sun.security.util.PendingException;

import java.util.HashMap;
import java.util.Map;

import static gherkin.deps.com.google.gson.internal.$Gson$Types.arrayOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by bjg on 06.03.2017.
 */
//@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RegisterApplication.class, webEnvironment = RANDOM_PORT)
@ContextConfiguration
public class RestCreateNewDatasetSteps {

    @Autowired
    private TestRestTemplate restTemplate;


    @Given("^Elasticsearch is running$")
    public void elasticsearch_is_running() throws Throwable {
        assertThat(restTemplate.getForObject("http://localhost:9200/_cluster/health", String.class), containsString("elasticsearch"));;
    }


    @And("^webservice is running$")
    public void webservice_is_running() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
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


    @Given("^user has access to register in the catalog$")
    public void user_has_access_to_register_in_the_catalog() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @When("^a the user chooses to create a new dataset$")
    public void a_the_user_chooses_to_create_a_new_dataset() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @Then("^status code HTTP (\\d+) Created is returned$")
    public void status_code_HTTP_Created_is_returned(int arg1) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @Then("^Json containing the dataset id is returned in http body$")
    public void json_containing_the_dataset_id_is_returned_in_http_body() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

}
