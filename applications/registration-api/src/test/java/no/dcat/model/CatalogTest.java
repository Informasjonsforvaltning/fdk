package no.dcat.model;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class CatalogTest {


    @Test
    public void catalogsWithDifferentUrlAreNotEqual() throws Exception {
        Catalog catalog = new Catalog();
        catalog.setUri("123");

        Catalog catalog2 = new Catalog();
        catalog2.setUri("1234");

        assertThat(catalog, not(catalog2));
    }

    @Test
    public void catalogsWithSameUrlAreEqual() throws Exception {
        Catalog catalog = new Catalog();
        catalog.setUri("123");

        Catalog catalog2 = new Catalog();
        catalog2.setUri("123");

        assertThat(catalog, is(catalog2));
    }


    @Test
    public void catalogWithSameUrlHaveSameHashcode() throws Exception {
        Catalog catalog = new Catalog();
        catalog.setUri("123");

        Catalog catalog2 = new Catalog();
        catalog2.setUri("123");

        assertThat(catalog.hashCode(), is(catalog2.hashCode()));
    }

}
