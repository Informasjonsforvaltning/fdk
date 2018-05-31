package no.dcat.factory;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
/**
 * Created by bjg on 02.05.2018.
 */
@Category(UnitTest.class)
public class DatasetIdGeneratorTest {

    @Test
    public void datasetIdIsGenerated() throws Exception {
        DatasetIdGenerator generator = new DatasetIdGenerator();
        String datasetId = generator.createId();

        assertThat(datasetId, is(notNullValue()));
    }
}
