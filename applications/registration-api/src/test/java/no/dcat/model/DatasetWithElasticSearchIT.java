package no.dcat.model;

import no.dcat.service.DatasetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("unit-integration")
public class DatasetWithElasticSearchIT {

    @Value("${data.elasticsearch.clusterNodes}")
    private String clusterNodes;


    @Value("${data.elasticsearch.clusterName}")
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
        Map<String,String> languangeDescription = new HashMap<>();
        languangeDescription.put("no","test");
        dataset.setDescription(languangeDescription);

        datasetRepository.save(dataset);

        assertThat(datasetRepository.findOne("1"), is(dataset));

        datasetRepository.delete(dataset);
    }

    @Test
    public void getAllDatasetsWithStatusPublished() throws Throwable {
        Dataset datasetPublished = new Dataset("1");
        datasetPublished.setCatalog("cat1");
        datasetPublished.setRegistrationStatus(Dataset.REGISTRATION_STATUS_PUBLISH);
        datasetRepository.save(datasetPublished);

        Dataset datasetDraft = new Dataset("2");
        datasetDraft.setCatalog("cat1");
        datasetDraft.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);
        datasetRepository.save(datasetDraft);

        Page<Dataset> actual = datasetRepository.findByCatalogAndRegistrationStatus("cat1", Dataset.REGISTRATION_STATUS_PUBLISH, new PageRequest(0, 20));

        assertThat(actual.getTotalElements(), is(1L));

        assertThat(actual.getContent().get(0).getId(), is("1"));

        Page<Dataset> all = datasetRepository.findByCatalog("cat1", new PageRequest(0, 20));

        assertThat(all.getTotalElements(), is(2L));

    }
}