package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.testcategories.IntegrationTest;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@ActiveProfiles("unit-integration")
@Category(IntegrationTest.class)
@RunWith(SpringRunner.class)
public class ElasticsearchServiceTest {

    @Test
    @Ignore
    public void check() throws Throwable {
        ElasticsearchService elasticsearchService = new ElasticsearchService(new ObjectMapper());
        elasticsearchService.setElasticserchCluster("localhost:9300", "elasticsearch");

    }

}
