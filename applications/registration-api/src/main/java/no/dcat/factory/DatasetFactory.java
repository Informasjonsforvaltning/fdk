package no.dcat.factory;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.springframework.beans.BeanUtils;

import java.util.Date;
import java.util.UUID;

import static java.lang.String.format;

public class DatasetFactory {
    private static final String BRREG_BASE = "http://brreg.no";

    public static Dataset create(Catalog catalog, Dataset dataset) {
        Dataset createdDataset = new Dataset();

        BeanUtils.copyProperties(dataset, createdDataset);

        createdDataset.setId(UUID.randomUUID().toString());
        createdDataset.setCatalogId(catalog.getId());
        createdDataset.setUri(format("%s/datasets/%s", getCatalogUri(catalog.getId()), createdDataset.getId()));
        createdDataset.set_lastModified(new Date());

        if (createdDataset.getRegistrationStatus() == null) {
            createdDataset.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);
        }

        if (createdDataset.getPublisher() == null) {
            createdDataset.setPublisher(catalog.getPublisher());
        }

        return createdDataset;
    }

    private static String getCatalogUri(String catalogId) {
        return format("%s/catalogs/%s", BRREG_BASE, catalogId);
    }
}

