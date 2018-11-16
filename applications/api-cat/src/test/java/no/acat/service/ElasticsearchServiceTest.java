package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.testcategories.UnitTest;
import no.acat.utils.Utils;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.shared.testcategories.IntegrationTest;
import org.elasticsearch.client.Client;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class ElasticsearchServiceTest {

    ElasticsearchService elasticsearchService;
    ElasticsearchService spyElasticsearchService;
    Elasticsearch5Client spyElasticsearch5Client;

    @Mock
    Elasticsearch5Client mockElasticsearch5Client;

    @Mock
    Client client;

    @Before
    public void setup() {

        MockitoAnnotations.initMocks(this);

        elasticsearchService = mock(ElasticsearchService.class);

        ObjectMapper mapper = Utils.jsonMapper();
          spyElasticsearchService = spy(new ElasticsearchService(mapper, "elasticsearch5", "elasticsearch"));

    }

    @Test
    public void constructorTest() {
        new ElasticsearchService(new ObjectMapper(), "localhost:9300", "elasticsearch");
    }


}
