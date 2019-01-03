package no.dcat.factory;

import no.dcat.model.Dataset;

import java.util.UUID;

public class RegistrationFactory {

    public static Dataset createDataset(String catalogId) {
        Dataset dataset = new Dataset();

        dataset.setId(UUID.randomUUID().toString());
        dataset.setUri(getCatalogUri(catalogId) + "/datasets/" + dataset.getId());
        dataset.setCatalogId(catalogId);

        return dataset;
    }

    public static String getCatalogUri(String catalogId) {
        return "http://brreg.no" + "/catalogs/" + catalogId;
    }

}
