package no.dcat.service;

import no.dcat.RegisterApplication;
import no.dcat.model.Dataset;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created by bjg on 24.02.2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = RegisterApplication.class)
@WebAppConfiguration
@ActiveProfiles(value = "unit-integration")
public class DatasetControllerTest {
    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8"));

    private MockMvc mockMvc;
    private HttpMessageConverter mappingJackson2HttpMessageConverter;

    private List<Dataset> datasetList = new ArrayList<>();

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private WebApplicationContext ctx;

    @Autowired
    void setConverters(HttpMessageConverter<?>[] converters) {

        this.mappingJackson2HttpMessageConverter = Arrays.asList(converters).stream()
                .filter(hmc -> hmc instanceof MappingJackson2HttpMessageConverter)
                .findAny()
                .orElse(null);

        assertNotNull("the JSON message converter must not be null",
                this.mappingJackson2HttpMessageConverter);
    }


    protected String json(Object o) throws IOException {
        MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
        this.mappingJackson2HttpMessageConverter.write(
                o, MediaType.APPLICATION_JSON, mockHttpOutputMessage);
        return mockHttpOutputMessage.getBodyAsString();
    }


    @Before
    public void setup() throws Exception {
        this.mockMvc = webAppContextSetup(ctx).build();

        this.datasetRepository.deleteAll();

        this.datasetList.add(datasetRepository.save(new Dataset("ID-001")));
        this.datasetList.add(datasetRepository.save(new Dataset("ID-002")));
    }



    @Test
    public void datasetNotFound() throws Exception {
        mockMvc.perform(get("dataset/ID-999"))
                .andExpect(status().isNotFound());
    }


    @Test
    public void readSingleDataset() throws Exception {
        mockMvc.perform(get("/dataset/"
                + this.datasetList.get(0).getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(jsonPath("$.id", is(this.datasetList.get(0).getId())));
    }


    @Test
    public void createDataset() throws Exception {
        Dataset dataset = new Dataset("ID-003");
        String datasetJson = json(dataset);

        this.mockMvc.perform(post("/dataset")
                .contentType(contentType)
                .content(datasetJson))
                .andExpect(status().isCreated());
    }



}
