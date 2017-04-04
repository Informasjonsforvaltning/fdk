package no.dcat.bddtest.cucumber.glue;

import cucumber.api.PendingException;
import cucumber.api.java.en.When;
import no.dcat.model.Dataset;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by bjg on 08.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
public class DeleteDatasetSteps extends AbstractSpringCucumberTest {

    @When("^a the user chooses to delete a dataset$")
    public void a_the_user_chooses_to_delete_a_dataset() throws Throwable {
        String datasetId = "101";
        Dataset dataset = new Dataset(datasetId);

        Map languageTitle = new HashMap();
        languageTitle.put("nb","Test-tittel");
        dataset.setTitle(languageTitle);
        dataset.setCatalog("974760673");

        Dataset result = restTemplate.withBasicAuth("bjg", "123")
                .postForObject("/catalogs/974760673/datasets/", dataset, Dataset.class);

        HttpHeaders headers = createHeaders("bjg","123");
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> deleteRequest = new HttpEntity<String>(headers);

        String datasetResUrl = "/catalogs/974760673/datasets/101";
        response = restTemplate.exchange(datasetResUrl, HttpMethod.DELETE, deleteRequest, String.class);
    }
}
