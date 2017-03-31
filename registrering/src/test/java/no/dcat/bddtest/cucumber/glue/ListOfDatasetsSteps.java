package no.dcat.bddtest.cucumber.glue;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import cucumber.api.DataTable;
import cucumber.api.PendingException;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import net.minidev.json.JSONArray;
import no.dcat.model.Dataset;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.hal.Jackson2HalModule;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 08.03.2017.
 */
@ActiveProfiles(value = "unit-integration")
public class ListOfDatasetsSteps extends AbstractSpringCucumberTest {
    @Given("^catalog contains the follwing datasets \\(title\\):$")
    public void catalog_contains_the_follwing_datasets_title(List<String> datasetTitles) throws Throwable {

        String catalogId = "974760673";
        int did = 1;

        for(String title : datasetTitles) {
            String datasetId = Integer.toString(did);
            Dataset dataset = new Dataset(datasetId);
            Map languageTitle = new HashMap();
            languageTitle.put("nb", title);
            dataset.setTitle(languageTitle);
            dataset.setCatalog(catalogId);

            did++;

            Dataset result = restTemplate.withBasicAuth("bjg", "123")
                    .postForObject("/catalogs/" + catalogId + "/datasets/", dataset, Dataset.class);

            assertThat(result.getTitle().get("nb"), is(equalTo(title)));
        }
    }

    @Then("^I can see a list of my datasets with the values \\(title, last changed\\)$")
    public void i_can_see_a_list_of_my_datasets_with_the_values_title_last_changed(List<List<String>> expectedDatasets) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        // For automatic transformation, change DataTable to one of
        // List<YourType>, List<List<E>>, List<Map<K,V>> or Map<K,V>.
        // E,K,V must be a scalar (String, Integer, Date, enum etc)

        //Get all datasets in catalog
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> getRequest = new HttpEntity<String>(headers);

        // this returns links content and page information
        ResponseEntity<String> re = restTemplate.getForEntity("/catalogs/974760673/datasets", String.class);
        assertThat(re.getStatusCode(), is(HttpStatus.OK));

        JSONArray datasets = JsonPath.read(re.getBody(), "$.content");
        /*

        // see https://izeye.blogspot.no/2015/01/consume-spring-data-rest-hateoas-hal.html
        // TODO this does not return any content !!!
        ResponseEntity<PagedResources<Dataset>> responseEntity = restTemplate
                .exchange( "/catalogs/974760673/datasets",
                HttpMethod.GET,
                getRequest,
                new ParameterizedTypeReference<PagedResources<Dataset>>() {}
                );

         PagedResources<Dataset> prd = responseEntity.getBody();
         Iterator<Dataset> actualDatasets = prd.iterator();

        */

        //Check that content matches
        for(List<String> expectedDataset : expectedDatasets) {
            //title is first row
            String expectedTitle = expectedDataset.get(0);
            boolean found = false;
            // there are more than two datasets in the embedded testbase
            for (int i = 0; i < datasets.size(); i++) {
                Map<String,Object> o = (Map<String,Object>)datasets.get(i);
                Map<String,Object> t = (Map<String,Object>)o.get("title");

                String acutalTitle = (String) t.get("nb");

                if (expectedTitle.equals(acutalTitle)) {
                    found = true;
                    break;
                }
            }

            assertThat(found, is(true));
        }

    }


}
