package no.dcat.model;

import no.dcat.service.DatasetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("unit-integration")
public class DatasetWithElasticSearchIT {

    @Value("${spring.data.elasticsearch.clusterNodes}")
    private String clusterNodes;


    @Value("${spring.data.elasticsearch.clusterName}")
    private String clusterName;

    @PostConstruct
    void validate(){
        assert clusterNodes != null;
        assert clusterName != null;

    }


    @Autowired
    private DatasetRepository datasetRepository;

    @Test
    public void elasticsearchCanStoreData_usingTemplate() throws Exception {

        Dataset dataset = new Dataset("1");
        Map<String, String> languangeDescription = new HashMap<>();
        languangeDescription.put("no","test");
        dataset.setDescription(languangeDescription);

        datasetRepository.save(dataset);

        assertThat(datasetRepository.findOne("1"), is(dataset));

        datasetRepository.delete(dataset);
    }
}