package no.dcat.model;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class DatasetFactory {

    private String searchPublicUrl;

    public DatasetFactory(@Value("${application.searchPublicUrl}") String searchPublicUrl) {
        this.searchPublicUrl = searchPublicUrl;
    }

    public Dataset createDataset(Catalog catalog, Dataset data) {
        Dataset dataset = new Dataset();

        BeanUtils.copyProperties(data, dataset);

        // overwrite required fields
        String id = UUID.randomUUID().toString();
        dataset.setId(id);
        dataset.setCatalogId(catalog.getId());
        dataset.setUri(generateDatasetUri(id));

        dataset.setPublisher(catalog.getPublisher());

        dataset.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);

        //Store metainformation about editing
        dataset.set_lastModified(new Date());
        return dataset;
    }

    String generateDatasetUri(String id) {
        return searchPublicUrl + "/datasets/" + id;
    }

}
