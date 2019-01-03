package no.dcat.factory;

import no.dcat.model.Dataset;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertThat;

/**
 * Created by bjg on 02.05.2018.
 */
@Category(UnitTest.class)
public class DatasetFactoryTest {

    @Test
    public void datasetCreatedWithCorrectUri() {
        String catalogId = "12345";
        Dataset result = DatasetFactory.createDataset(catalogId);

        assertThat(result.getUri(), containsString("http://brreg.no/catalogs/" + catalogId + "/datasets/"));

    }
}
