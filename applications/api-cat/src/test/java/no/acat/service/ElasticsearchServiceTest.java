package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

@Category(UnitTest.class)
public class ElasticsearchServiceTest {

    @Test
    public void constructorTest() {
        new ElasticsearchService(new ObjectMapper(), "localhost:9300", "elasticsearch");
    }

}
