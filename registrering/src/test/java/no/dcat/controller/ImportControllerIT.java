package no.dcat.controller;

import no.dcat.model.Catalog;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;

public class ImportControllerIT {

    @Autowired
    ImportController importController = new ImportController();

    @Test
    public void importCatalogOK() throws Throwable {
        String catalogId = "958935420";

        String url = "http://portal-fdk.tt1.brreg.no/catalogs?id=http://data.brreg.no/datakatalog/katalog/958935420/k-1&format=ld+json";

        HttpEntity<Catalog> response = importController.importCatalog(catalogId, url);



    }

}