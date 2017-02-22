package no.dcat.model;

import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class DatasetTest {

    @Test
    public void sameId_isEqual() throws Exception {
        Dataset dataset = new Dataset("1");
        Dataset dataset1 = new Dataset("1");
        assertThat(dataset, is(dataset1));
    }

    @Test
    public void toString_makesSense() throws Exception {
        Dataset dataset = new Dataset("1");
        dataset.setDescription("Test");
        assertThat(dataset.toString(), is("Dataset(1, Test)"));
    }

}