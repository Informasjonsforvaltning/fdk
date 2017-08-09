package no.dcat.bddtest.cucumber.glue;

import cucumber.api.PendingException;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import no.dcat.model.Dataset;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 08.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
public class DeleteDatasetAccesDeniedSteps extends AbstractSpringCucumberTest{

    ResponseEntity<String> response;

    @Given("^user try to delete a dataset in a catalog he has no access to$")
    public void user_try_to_delete_a_dataset_in_a_catalog_he_has_no_access_to() throws Throwable {
        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);
        dataset.setCatalog(getCatalogId());

        String callUrl = "/catalogs/"+getCatalogId()+"/datasets/";
        Dataset result = restTemplate
                .postForObject(callUrl, dataset, Dataset.class);

        //Notice: no authorisation
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> deleteRequest = new HttpEntity<String>(headers);

        String datasetResUrl = callUrl + result.getId();
        response = restTemplate.withBasicAuth("bjg", "123").exchange(datasetResUrl, HttpMethod.DELETE, deleteRequest, String.class);

    }

    @Then("^status code HTTP (\\d+) Unathorized is returned$")
    public void status_code_HTTP_Unathorized_is_returned(int arg1) throws Throwable {
        assertThat(response.getStatusCode(), is(HttpStatus.UNAUTHORIZED));

    }
}
