package no.dcat.controller;


import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.SkosCode;
import no.dcat.model.exceptions.CodesImportException;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;

public class ImportControllerTest {

    ImportController importController;
    Model model;

    @Before
    public void setup() {
        model = FileManager.get().loadModel("export.jsonld");

        ImportController imp = new ImportController(null, null, null);
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


    @Test
    public void publisherContainsMultipleNamesWhenOnlyOneIsExpected() throws Throwable {
        model = FileManager.get().loadModel("ut1-export.ttl");

        ImportController impController = new ImportController(null,null,null);
        ImportController iController = Mockito.spy(impController);
        Map<String,String> prefLabel = new HashMap<>();
        prefLabel.put("no", "test");

        doNothing().when(iController).fetchCodes();
        doReturn(prefLabel).when(iController).getLabelForCode(anyString(), anyString());

        List<Dataset> ds = iController.parseDatasets(model);

        assertThat(ds.size(), is(27));
    }


    @Test
    public void testLanguagePruning(){

        SkosCode skosCode1 = new SkosCode();

        skosCode1.getPrefLabel().put("en", "english");
        skosCode1.getPrefLabel().put("fi", "finish");


        SkosCode skosCode2 = new SkosCode();

        skosCode2.getPrefLabel().put("en", "english");
        skosCode2.getPrefLabel().put("no", "norwegian");

        List<SkosCode> skosCodes = Arrays.asList(skosCode1, skosCode2, skosCode1, skosCode2);

        new ImportController(null,null,null).pruneLanguages(skosCodes);

        assertNull(skosCode1.getPrefLabel().get("fi"));

        assertNotNull(skosCode1.getPrefLabel().get("en"));
        assertNotNull(skosCode2.getPrefLabel().get("en"));
        assertNotNull(skosCode2.getPrefLabel().get("no"));

    }


}
