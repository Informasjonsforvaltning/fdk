package no.dcat.controller;


import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CodesImportException;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class ImportControllerTest {

    ImportController importController;
    Model model;

    @Before
    public void setup() {
        model = FileManager.get().loadModel("export.jsonld");

        ImportController imp = new ImportController();
        importController = Mockito.spy(imp);

    }



    @Test
    public void framingDataset() throws IOException {
        Mockito.doNothing().when(importController).postprosessDatasetAttributes(Matchers.anyObject());
        List<Dataset> ds = importController.parseDatasets(model);

        assertThat(ds.size(), is(27));
    }

    @Test
    public void framingCatalog() throws IOException {
        Mockito.doNothing().when(importController).postprosessDatasetAttributes(Matchers.anyObject());
        List<Catalog> ds = importController.parseCatalogs(model);

        assertThat(ds.size(), is(1));
    }

    @Test(expected = CodesImportException.class)
    public void fetchOfCodesFails() throws Throwable {
        Mockito.doThrow(new CodesImportException("test")).when(importController).fetchCodes();

        importController.fetchCodes();

    }


    @Test(expected = ResourceAccessException.class)
    public void fetchOfCodesFailsURLNotValid() throws Throwable {

        importController.fetchCodes();

    }

    /*
    @Test(expected = IllegalStateException.class)
    public void troubledInFraming() throws Throwable {
        model = FileManager.get().loadModel("ut1-export.ttl");

        ImportController imp = new ImportController();
        importController = Mockito.spy(imp);

        List<Dataset> ds = importController.parseDatasets(model);

        assertThat(ds.size(), is(27));
    }
    */


}
