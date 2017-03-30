package no.dcat.bddtest.cucumber.glue;

import cucumber.api.PendingException;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import no.dcat.model.Dataset;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.ResourceAccessException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.not;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 07.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
public class RestCreateNewDatasetAccessDeniedSteps extends AbstractSpringCucumberTest {

    ResponseEntity<Dataset> response;
    private List<RuntimeException> exceptions = new ArrayList<>();


    @When("^user try to register a new dataset in a catalog he has no access to$")
    public void user_try_to_register_a_new_dataset_in_a_catalog_he_has_no_access_to() throws Throwable {

    }

    private void tryRegisterDataset() {
        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);

        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);

        dataset.setCatalog("974760673");

        HttpEntity<Dataset> request = new HttpEntity<Dataset>(dataset);

        String datasetResUrl = "/catalogs/974760673/datasets/";

        try {
            response = restTemplate.exchange(datasetResUrl, HttpMethod.POST, request, Dataset.class);
        } catch (RuntimeException e) {
            exceptions.add(e);
        }
    }

    @Then("^status code HTTP (\\d+) Unauthorized is returned$")
    public void status_code_HTTP_Unauthorized_is_returned(int arg1) throws Throwable {

        //Either a HTTP unautoriszed is returned, or a ResourceAccessException is thrown
        tryRegisterDataset();

        if (response != null) {
            assertThat(response.getStatusCode(), is(HttpStatus.UNAUTHORIZED));
        } else {
            assertThat(exceptions.size(), is(greaterThan(0)));
        }
    }

}
