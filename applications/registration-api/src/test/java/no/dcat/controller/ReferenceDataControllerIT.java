package no.dcat.controller;

import com.google.gson.Gson;
import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Category(IntegrationTest.class)
public class ReferenceDataControllerIT {

    @Autowired
    private MockMvc mockMvc;

    public static String asJsonString(Object obj) {

        return new Gson().toJson(obj);

    }

    @Test
    @WithUserDetails("03096000854")
    public void getSubjectTest() throws Exception {

        mockMvc
            .perform(MockMvcRequestBuilders.get("/referenceData/subjects", String.class).param("uri", "https://data-david.github.io/Begrep/begrep/Hovedenhet"))
            .andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
            .andExpect(MockMvcResultMatchers.content().json("{\"uri\":\"https://data-david.github.io/Begrep/begrep/Hovedenhet\",\"prefLabel\":{\"no\":\"hovedenhet\"}}"));
    }

    @Test
    public void getSubjectAnonymousFailsTest() throws Exception {

        mockMvc
            .perform(MockMvcRequestBuilders.get("/referenceData/subjects", String.class).param("uri", "https://data-david.github.io/Begrep/begrep/Hovedenhet"))
            .andExpect(MockMvcResultMatchers.status().is3xxRedirection()); // redirect to login page

    }

}
