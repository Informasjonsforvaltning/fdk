package no.ccat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@ActiveProfiles("unit-integration")
@Category(IntegrationTest.class)
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ElasticsearchServiceTest {

    @Autowired
    ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    ObjectMapper mapper;

    @Test
    @Ignore // todo this is springboottest, so it loads entire world. it is very slow, use mocking and unit test instead.
    public void check() throws Throwable {
        ElasticsearchService elasticsearchService = new ElasticsearchService(elasticsearchTemplate, mapper);
    }
}
