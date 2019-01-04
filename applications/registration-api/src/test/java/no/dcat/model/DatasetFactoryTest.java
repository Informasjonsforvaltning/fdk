package no.dcat.model;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 02.05.2018.
 */
@Category(UnitTest.class)
public class DatasetFactoryTest {
    DatasetFactory datasetFactory;
    String urlBase="urlbase";
    @Before
    public void setup() {
        datasetFactory = new DatasetFactory(urlBase);
    }

    @Test
    public void datasetCreatedWithCorrectUri() {
        String catalogId = "12345";
        Catalog catalog = new Catalog();
        catalog.setId(catalogId);
        Dataset data = new Dataset();
        Dataset dataset = datasetFactory.createDataset(catalog, data);

        assertEquals(dataset.getUri(), urlBase+"/datasets/" + dataset.getId());
    }
}
