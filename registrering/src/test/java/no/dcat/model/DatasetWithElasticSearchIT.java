package no.dcat.model;

import no.dcat.service.DatasetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("unit-integration")
public class DatasetWithElasticSearchIT {

    @Value("${spring.data.elasticsearch.cluster-nodes}")
    private String clusterNodes;


    @Value("${spring.data.elasticsearch.cluster-name}")
    private String clusterName;

    @Autowired
    private DatasetRepository datasetRepository;

    @Test
    public void elasticsearchCanStoreData_usingTemplate() throws Exception {
        assertThat(clusterNodes, is("localhost:9300"));
        assertThat(clusterName, is("elasticsearch"));

        Dataset dataset = new Dataset("1");
        dataset.setDescription("Test");

        datasetRepository.save(dataset);

        assertThat(datasetRepository.findOne("1"), is(dataset));

        datasetRepository.delete(dataset);
    }
}