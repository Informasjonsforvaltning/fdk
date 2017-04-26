package no.dcat.validation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import gherkin.lexer.Th;
import no.dcat.validation.model.PropertyRule;
import no.dcat.validation.model.Validation;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 24.04.2017.
 */
public class ValidateDatasetTest {
    private static final Logger logger = LoggerFactory.getLogger(ValidateDatasetTest.class);

    private ValidationController controller;
    private ObjectMapper mapper;

    @Before
    public void setup() {
        controller = new ValidationController();
        mapper = new ObjectMapper();
    }

    @Test
    public void testSomeFieldsOfSimpleDataset() throws Throwable {

        // create simple dataset
        Map<String, Object> dataset = new HashMap<>();
        dataset.put("title", map("nb", "Tittel"));
        dataset.put("description", map("nb", "Beskrivelse"));

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "title,description,issued");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(0));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testIllegalMinCountCorrectlyDetected() throws Throwable {

        // create simple dataset
        Map<String, Object> dataset = new HashMap<>();

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "title");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(2));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testIllegalMaxCountCorrectlyDetected() throws Throwable {

        List<String> list = new ArrayList<>();
        list.add("2017-01-01");
        list.add("2017-02-02");
        // create simple dataset
        Map<String, Object> dataset = new HashMap<>();
        dataset.put("issued", list);

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "issued");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("oks", actualResponse.getBody().getOks(), is(0));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testIllegalNodekindNotLiteralDetected() throws Throwable {
        // create simple dataset
        Map<String, Object> dataset = new HashMap<>();
        dataset.put("title", new PropertyRule());

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "title");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testIllegalNodekindNotLiteralInCollectionDetected() throws Throwable {
        // create simple dataset
        Map<String, Object> dataset = new HashMap<>();
        List<PropertyRule> list = new ArrayList<>();
        list.add(new PropertyRule());
         dataset.put("title", list);

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "title");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testAllFieldsOfCompleteDataset() throws Throwable {
        Resource p = new ClassPathResource("sample-dataset-complete.json");
        ObjectMapper objectMapper = new ObjectMapper();


        Map<String, Object> dataset = objectMapper.readValue(p.getInputStream(), Map.class);
        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("oks", actualResponse.getBody().getOks(), is(39));
        assertThat("errors", actualResponse.getBody().getErrors(), is(0));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(1));
    }

    @Test
    public void testCheckClassViolationIsDetected() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        dataset.put("type", new PropertyRule());

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "type");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testCheckCollectionClassViolationIsDetected() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        List<PropertyRule> list = new ArrayList<>();
        list.add (new PropertyRule());
        list.add (new PropertyRule());

        dataset.put("type", list);

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "type");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(2));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testCheckCollectionOfLiteralsFailsOK() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        List<Object> list = new ArrayList<>();

        list.add ("OK");
        list.add(map("nb", "TTT"));
        list.add (new PropertyRule());

        dataset.put("identifier", list);

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "identifier");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testAccessRightsConditionalError() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        dataset.put("accessRights", map("code", "RESTRICTED"));

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "accessRightsComment");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("Oks", actualResponse.getBody().getOks(), is(1));
        assertThat("errors", actualResponse.getBody().getErrors(), is(1));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testAccessRightsConditionalOK() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        dataset.put("accessRights", map("code", "public"));

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "accessRightsComment");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("Oks", actualResponse.getBody().getOks(), is(2));
        assertThat("errors", actualResponse.getBody().getErrors(), is(0));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }

    @Test
    public void testAccessRightsConditionOK() throws Throwable {
        Map<String, Object> dataset = new HashMap<>();

        dataset.put("accessRights", map("code", "RESTRICTED"));

        Map<String,String> comment = new HashMap<>();
        comment.put("code", "Any comment will do");

        dataset.put("accessRightsComment", Collections.singletonList(comment));

        ResponseEntity<Validation> actualResponse = controller.validateDataset(new HttpEntity<>(dataset), "accessRightsComment");

        assertThat(actualResponse.getStatusCode(), is(HttpStatus.OK));
        assertThat("oks", actualResponse.getBody().getOks(), is(2));
        assertThat("errors", actualResponse.getBody().getErrors(), is(0));
        assertThat("warnings", actualResponse.getBody().getWarnings(), is(0));
    }


    Map<String, String> map(String lang, String title) {
        Map<String, String> result = new HashMap<>();
        result.put(lang, title);

        return result;
    }
}
