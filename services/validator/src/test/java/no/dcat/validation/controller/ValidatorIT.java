package no.dcat.validation.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by dask on 04.05.2017.
 */
@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class ValidatorIT {


    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void actuatorIsRunning() throws Exception {
        assertThat(restTemplate.getForObject("/health", String.class), containsString("UP"));
    }

    @Test
    public void webserviceIsRunning() throws Exception {
        assertThat(restTemplate.getForObject("/", String.class), containsString("_links"));
    }

    @Test
    public void validateDatasetSome() throws Exception {

        Map<String, Object> dataset = new HashMap<>();
        Map<String, String> description = new HashMap<>();
        description.put("no", "test");
        dataset.put("description", description);

        Map<String, String> title = new HashMap<>();
        title.put("no", "test");
        dataset.put("title",title);

        Map<String,Object> actual =  restTemplate.postForObject("/dataset/title,description,identifier", dataset, Map.class);

        assertThat(actual.get("oks"), is(4));
        assertThat(actual.get("errors"), is(2));

    }
}