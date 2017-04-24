package no.dcat.validation.controller;

import no.dcat.validation.model.Validation;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

/**
 * Created by dask on 24.04.2017.
 */
public class ValidateDatasetTest {

    @Test
    public void testSimpleDataset() throws Throwable {

        ValidationController controller = new ValidationController();

        Map<String, Object> dataset = new HashMap<>();
        dataset.put("title", langMap("nb", "Tittel") );
        dataset.put("description", langMap( "nb", "Beskrivelse"));

        ResponseEntity<Validation> actualResponse = controller.validateDataset(dataset, "title,description,issued");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat(actualResponse.getBody().getErrors(), is(0));
    }

    Map<String, String> langMap(String lang, String title) {
        Map<String, String> result = new HashMap<>();
        result.put(lang, title);

        return result;
    }
}
