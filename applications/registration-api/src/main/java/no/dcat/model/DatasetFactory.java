package no.dcat.model;

import org.springframework.beans.BeanUtils;

import java.util.Date;
import java.util.UUID;

public class DatasetFactory {


    public static Dataset createDataset(Catalog catalog, Dataset data) {
        Dataset dataset = new Dataset();

        BeanUtils.copyProperties(data, dataset);

        // overwrite required fields
        dataset.setId(UUID.randomUUID().toString());
        dataset.setCatalogId(catalog.getId());
        dataset.setUri(getCatalogUri(catalog.getId()) + "/datasets/" + dataset.getId());

        dataset.setPublisher(catalog.getPublisher());

        dataset.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);

        //Store metainformation about editing
        dataset.set_lastModified(new Date());
        return dataset;
    }

    public static String getCatalogUri(String catalogId) {
        return "http://brreg.no" + "/catalogs/" + catalogId;
    }

}
