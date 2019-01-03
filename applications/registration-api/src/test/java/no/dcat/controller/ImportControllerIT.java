package no.dcat.controller;

import no.dcat.datastore.ElasticDockerRule;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.service.CatalogRepository;
import no.dcat.shared.testcategories.IntegrationTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;


@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@Category(IntegrationTest.class)
public class ImportControllerIT {
    @ClassRule
    public static ElasticDockerRule elasticRule = new ElasticDockerRule();
    private static Logger logger = LoggerFactory.getLogger(ImportControllerIT.class);
    Model model;
    @Autowired
    ImportController importController;

    @Autowired
    CatalogController catalogController;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private CatalogRepository catalogRepository;

    @Before
    public void before() {
        try {
            catalogRepository.deleteAll();
        } catch (Exception e) {
            logger.debug("catalogRepository was probably empty");
        }
    }

    @Test
    public void importDatasets() throws IOException {
        model = FileManager.get().loadModel("export.jsonld");

        List<Dataset> ds = importController.parseDatasets(model);

        assertThat(ds.size(), is(27));
    }

    @Test
    public void parseCatalogsReturnsWithContent() throws IOException {
        model = FileManager.get().loadModel("export.jsonld");
        List<Catalog> ds = importController.parseCatalogs(model);

        assertThat(ds.size(), is(1));
    }

    @Test
    public void parseCatalogFindsExistingCatalogInExternalData() throws IOException, CatalogNotFoundException {
        model = FileManager.get().loadModel("export.jsonld");
        Catalog existingCat = new Catalog();
        existingCat.setId("http://data.brreg.no/datakatalog/katalog/974760673/1");
        Catalog resultCat = importController.parseCatalog(model, existingCat, "http://data.brreg.no/datakatalog/katalog/974760673/1");

        assertThat(resultCat.getId(), is(existingCat.getId()));
    }


    @Test(expected = CatalogNotFoundException.class)
    public void parseCatalogNonexistingCatalogThrowsException() throws IOException, CatalogNotFoundException {
        model = FileManager.get().loadModel("export.jsonld");
        Catalog existingCat = new Catalog();
        existingCat.setId("doesNotExist");
        Catalog resultCat = importController.parseCatalog(model, existingCat, "doesNotExist");
    }


    @Test
    public void parseAndSaveDatasetsOK() throws IOException {
        model = FileManager.get().loadModel("export.jsonld");
        Catalog existingCat = new Catalog();
        existingCat.setId("974760673");
        List<Dataset> result = importController.parseAndSaveDatasets(model, existingCat, "974760673");

        assertThat(result.size(), is(27));
    }


    @Test
    public void importCatalogFromGdocSubjectOK() throws Throwable {
        model = FileManager.get().loadModel("export-gdoc-2017-10-17.ttl");

        List<Dataset> ds = importController.parseDatasets(model);

        long countDatasetWithSubjects = ds.stream()
            .filter(dataset -> {
                if (dataset.getSubject() != null) return dataset.getSubject().size() > 0;
                else return false;
            })
            .peek(dataset -> {
                dataset.getSubject().forEach(subject -> {
                    assertThat(subject.getUri(), is(notNullValue()));
                });
            })
            .count();

        logger.info("gdoc {} datasets, wheras {} has subject", ds.size(), countDatasetWithSubjects);

        assertThat(countDatasetWithSubjects, is(17L));
        assertThat(ds.size(), is(132));
    }

/*  Commented out. Need to import from an url. And travis do not like that.
    @Test
    public void importOnlyDatasetsWithCatalog() throws  Throwable {

        String catalogId = "974760673";
        Catalog targetCatalog = new Catalog();
        targetCatalog.setId(catalogId);
        catalogRepository.save(targetCatalog);

        Catalog importCatalog = importController.importDatasets(catalogId,new URL("http://gdoc-fellesdatakatalog-ppe.ose-pc.brreg.no/versions/latest"));

        assertThat(importCatalog.getId(), is(catalogId));

    }
*/
//    @Test
//    public void importCatalogOK() throws Throwable {
//        String catalogId = "958935420";
//
//        // make sure catalogId exist in database
//        Catalog cat = new Catalog(catalogId);
//        catalogController.saveCatalog(cat);
//
//        //String url = "http://portal-fdk.tt1.brreg.no/catalogs?id=http://data.brreg.no/datakatalog/katalog/958935420/k-1&format=ttl";
//
//        HttpEntity<Catalog> response = importController.importCatalog(catalogId, "export-oslokommune.ttl");
//
//        Catalog catalogId = response.getBody();
//
//        assertThat(catalogId, is(notNullValue())) ;
//        assertThat(catalogId.getId(), is(catalogId));
//
//        assertThat(catalogId.getDataset().size(), is(5));
//
//    }
//
//    @Test
//    public void importCatalogWithDatasets() throws Exception {
//        String catalogId = "974760673";
//
//        // make sure catalogId exist in database
//        Catalog cat = new Catalog(catalogId);
//        catalogController.saveCatalog(cat);
//
//
//        HttpEntity<Catalog> result =  importController.importCatalog(catalogId, "export.jsonld");
//
//        Catalog catalogId = result.getBody();
//
//        assertThat(catalogId, is(notNullValue())) ;
//        assertThat(catalogId.getId(), is(catalogId));
//
//        assertThat(catalogId.getDataset().size(), is(27));
//
//    }
//
//    /**
//     * Catalog does not exist in database and should therefore not be imported!
//     *
//     * @throws Throwable
//     */
//    @Test(expected = CatalogNotFoundException.class)
//    public void importCatalogThrowsCatalogNotFoundException() throws Throwable {
//        String catalogId = "123456780";
//
//        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
//    }
//
//    /**
//     * Catalog found in database, but not in rdf file.
//     *
//     * @throws Throwable
//     */
//    @Test(expected = CatalogNotFoundException.class)
//    public void importCatalogThrowsCatalogNotFoundException2() throws Throwable {
//        String catalogId = "974760673";
//
//        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
//    }
//
//    /**
//     * Catalog found in import file, but has no dataset in the file.
//     * @throws Throwable
//     */
//    @Test(expected = CatalogNotFoundException.class)
//    public void importCatalogThrowsException() throws Throwable {
//        String catalogId = "958935420";
//
//        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "export-w-error.ttl");
//    }
//
//    /**
//     * Import data file not found
//     * @throws Throwable
//     */
//    @Test(expected = IOException.class)
//    public void importCatalogThrowsIOExceptionOnIllegalUrl() throws Throwable {
//        String catalogId = "958935420";
//
//        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "missing-import-file.ttl");
//
//    }
//
//    /**
//     * SkosCodes:
//     * language*
//     * spatial*
//     * accessRights
//     * provenance [
//     * accrualPeriodicity[frequency]
//     *
//     * @throws Throwable
//     */
//    @Test
//    public void frameDatasetAddsLabels() throws Throwable {
//        String catalogId = "974760673";
//
//        // make sure catalogId exist in database
//        Catalog cat = new Catalog(catalogId);
//        catalogController.saveCatalog(cat);
//
//        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "dataset-single.ttl");
//        List<Dataset> ds = result.getBody().getDataset();
//
//        assertThat(ds.size(), is(1));
//
//        Dataset d = ds.get(0);
//
//        assertThat(d.getAccrualPeriodicity().getPrefLabel().get("no"), is("kontinuerlig"));
//        assertThat(d.getLanguage().get(0).getPrefLabel().get("nb"), is("Norsk"));
//        assertThat(d.getAccessRights().getPrefLabel().get("nb"), is("Offentlig"));
//        assertThat(d.getProvenance().getPrefLabel().get("nb"), is("Tredjepart"));
//
//
//    }

    /*
    Test commented out because travis does not like accessing external urls
    @Test
    public void importBrreg() throws Throwable {
        String catalogId = "974760673";

        Catalog cat = new Catalog(catalogId);
        catalogController.saveCatalog(cat);

        HttpEntity<Catalog> result = importController.importCatalog(catalogId, "http://portal-fdk.ppe.brreg.no/catalogs?id=http://data.brreg.no/datakatalog/katalog/974760673/1&format=ttl");
        List<Dataset> ds = result.getBody().getDataset();

        assertThat(ds.size(), is(27));

        Dataset d = ds.get(0);
    }
    */


}
