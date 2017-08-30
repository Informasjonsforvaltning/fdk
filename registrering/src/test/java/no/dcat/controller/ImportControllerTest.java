package no.dcat.controller;


import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Test;

import java.io.IOException;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class ImportControllerTest {


    @Test
    public void framingDataset() throws IOException {

        Model model = FileManager.get().loadModel("export.jsonld");

        ImportController imp = new ImportController();

        List<Dataset> ds = imp.parseDatasets(model);

        assertThat(ds.size(), is(27));
    }

    @Test
    public void framingCatalog() throws IOException {

        Model model = FileManager.get().loadModel("export.jsonld");

        ImportController imp = new ImportController();

        List<Catalog> ds = imp.parseCatalogs(model);

        assertThat(ds.size(), is(1));
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
        Model model = FileManager.get().loadModel("dataset-single.ttl");

        ImportController imp = new ImportController();

        List<Dataset> ds = imp.parseDatasets(model);

        assertThat(ds.size(), is(1));

        Dataset d = ds.get(0);

        assertThat(d.getAccrualPeriodicity().getPrefLabel().get("no"), is("kontinuerlig"));

    }



}
