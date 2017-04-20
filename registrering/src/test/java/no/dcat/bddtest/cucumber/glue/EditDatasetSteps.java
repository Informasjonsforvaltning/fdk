package no.dcat.bddtest.cucumber.glue;

import cucumber.api.PendingException;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import no.dcat.model.Dataset;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 08.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
public class EditDatasetSteps extends AbstractSpringCucumberTest {

    @When("^a the user chooses to edit a dataset$")
    public void a_the_user_chooses_to_edit_a_dataset() throws Throwable {
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

        datasetResUrl = "/catalogs/974760673/datasets/" + result.getId();

        //Try to edit the dataset...
        Dataset datasetToEdit = restTemplate.getForObject(datasetResUrl, Dataset.class);

        Map descriptions = datasetToEdit.getDescription();
        descriptions.put("en", "English description");
        datasetToEdit.setDescription(descriptions);

        HttpHeaders headers = createHeaders("bjg","123");
        HttpEntity<Dataset> request = new HttpEntity<Dataset>(datasetToEdit, headers);

        response = restTemplate.exchange(datasetResUrl, HttpMethod.PUT, request, String.class);
    }

    String datasetResUrl;

    @Then("^the changed information is saved$")
    public void the_changed_information_is_saved() throws Throwable {
        //retrieve the dataset and chack that the english description was saved
        Dataset savedDataset = restTemplate.getForObject(datasetResUrl, Dataset.class);
        assertThat(savedDataset.getDescription().get("en"), is("English description"));

    }
}
