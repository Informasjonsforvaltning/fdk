package no.dcat.bddtest.cucumber.glue;

import cucumber.api.PendingException;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import no.dcat.model.Dataset;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 08.03.2017.
 */
public class EditDatasetAccessDeniedSteps extends AbstractSpringCucumberTest {

    ResponseEntity<Dataset> response;

    @When("^user try to edit a dataset in a catalog he has no access to$")
    public void user_try_to_edit_a_dataset_in_a_catalog_he_has_no_access_to() throws Throwable {

        //Preparation: Create a dataset and save it
        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);
        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);
        Map languangeDescription = new HashMap();
        languangeDescription.put("nb","test");
        dataset.setDescription(languangeDescription);
        dataset.setCatalog("974760673");
        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/974760673/datasets/", dataset, Dataset.class);


        //Try to edit the dataset...
        Dataset datasetToEdit = restTemplate.getForObject("/catalogs/974760673/datasets/101", Dataset.class);

        Map descriptions = datasetToEdit.getDescription();
        descriptions.put("en", "English description");
        datasetToEdit.setDescription(descriptions);

        //notice: no authentication
        HttpEntity<Dataset> request = new HttpEntity<Dataset>(dataset);
        String datasetResUrl = "/catalogs/974760673/datasets/101";
        try {
            response = restTemplate.exchange(datasetResUrl, HttpMethod.PUT, request, Dataset.class);
        } catch (ResourceAccessException e) {
            exceptions.add(e);
        }

    }

}
