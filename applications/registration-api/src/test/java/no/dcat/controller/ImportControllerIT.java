package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.DatasetNotFoundException;
import no.dcat.service.CatalogRepository;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;


@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
public class ImportControllerIT {
    private static Logger logger = LoggerFactory.getLogger(ImportControllerIT.class);

    @Autowired
    ImportController importController ;

    @Autowired
    CatalogController catalogController;

    @Autowired
    private CatalogRepository catalogRepository;

    @Before
    public void before() {
        catalogRepository.deleteAll();
    }
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
    @Test(expected = CatalogNotFoundException.class)
    public void importCatalogThrowsException() throws Throwable {
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

    /**
     * SkosCodes:
     * language*
     * spatial*
     * accessRights
     * provenance [
     * accrualPeriodicity[frequency]
     *
     * @throws Throwable
     */
    @Test
    public void frameDatasetAddsLabels() throws Throwable {
        String catalogId = "974760673";

        // make sure catalog exist in database
        Catalog cat = new Catalog(catalogId);
        catalogController.saveCatalog(cat);

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "dataset-single.ttl");
        List<Dataset> ds = result.getBody().getDataset();

        assertThat(ds.size(), is(1));

        Dataset d = ds.get(0);

        assertThat(d.getAccrualPeriodicity().getPrefLabel().get("no"), is("kontinuerlig"));
        assertThat(d.getLanguage().get(0).getPrefLabel().get("nb"), is("Norsk"));
        assertThat(d.getAccessRights().getPrefLabel().get("nb"), is("Offentlig"));
        assertThat(d.getProvenance().getPrefLabel().get("nb"), is("Tredjepart"));


    }


}