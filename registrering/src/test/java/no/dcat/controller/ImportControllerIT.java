package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.DatasetNotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;


@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest
public class ImportControllerIT {
    private static Logger logger = LoggerFactory.getLogger(ImportControllerIT.class);

    @Autowired
    ImportController importController ;

    @Autowired
    CatalogController catalogController;

    @Test
    public void importCatalogOK() throws Throwable {
        String catalogId = "958935420";

        // make sure catalog exist in database
        Catalog cat = new Catalog(catalogId);
        catalogController.saveCatalog(cat);

        //String url = "http://portal-fdk.tt1.brreg.no/catalogs?id=http://data.brreg.no/datakatalog/katalog/958935420/k-1&format=ttl";

        HttpEntity<Catalog> response = importController.importCatalog(catalogId, "export-oslokommune.ttl");

        Catalog catalog = response.getBody();

        assertThat(catalog, is(notNullValue())) ;
        assertThat(catalog.getId(), is(catalogId));

        assertThat(catalog.getDataset().size(), is(5));

    }

    @Test
    public void importCatalogWithDatasets() throws Exception {
        String catalogId = "974760673";

        // make sure catalog exist in database
        Catalog cat = new Catalog(catalogId);
        catalogController.saveCatalog(cat);


        HttpEntity<Catalog> result =  importController.importCatalog(catalogId, "export.jsonld");

        Catalog catalog = result.getBody();

        assertThat(catalog, is(notNullValue())) ;
        assertThat(catalog.getId(), is(catalogId));

        assertThat(catalog.getDataset().size(), is(27));

    }

    /**
     * Catalog does not exist in database and should therefore not be imported!
     *
     * @throws Throwable
     */
    @Test(expected = CatalogNotFoundException.class)
    public void importCatalogThrowsCatalogNotFoundException() throws Throwable {
        String catalogId = "123456780";

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
    }

    /**
     * Catalog found in database, but not in rdf file.
     *
     * @throws Throwable
     */
    @Test(expected = CatalogNotFoundException.class)
    public void importCatalogThrowsCatalogNotFoundException2() throws Throwable {
        String catalogId = "974760673";

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
    }

    /**
     * Catalog found in import file, but has no dataset in the file.
     * @throws Throwable
     */
    @Test(expected = DatasetNotFoundException.class)
    public void importCatalogThrowsDatasetNotFoundException() throws Throwable {
        String catalogId = "958935420";

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
    }

    /**
     * Import data file not found
     * @throws Throwable
     */
    @Test(expected = IOException.class)
    public void importCatalogThrowsIOExceptionOnIllegalUrl() throws Throwable {
        String catalogId = "958935420";

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "missing-import-file.ttl");

    }

}