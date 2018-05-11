package no.dcat.factory;

import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
/**
 * Created by bjg on 02.05.2018.
 */
public class DatasetIdGeneratorTest {

    @Test
    public void datasetIdIsGenerated() throws Exception {
        DatasetIdGenerator generator = new DatasetIdGenerator();
        String datasetId = generator.createId();

        assertThat(datasetId, is(notNullValue()));
    }
}
