package no.dcat.datastore.domain.dcat.vocabulary;

import no.dcat.shared.testcategories.UnitTest;
import org.apache.jena.rdf.model.Resource;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import javax.swing.*;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

@Category(UnitTest.class)
public class DQVTest {

    @Test
    public void testResolveDimensionNSprefixOK () throws Throwable {
        Resource actual = DQV.resolveDimensionResource("iso:Accuracy");

        assertThat(actual, is(DQV.Accuracy));
    }

    @Test
    public void testResolveDimensionOK() throws Throwable {
        Resource actual = DQV.resolveDimensionResource("http://iso.org/25012/2008/dataquality/Currentness");

        assertThat(actual, is(DQV.Currentness));
    }

    @Test
    public void testResolveDimensionWrongInput() throws Throwable {
        Resource actual = DQV.resolveDimensionResource("http://iso.orgyayay");

        assertThat(actual, is(nullValue()));
    }

    @Test
    public void testResolveDimensionNullInput() throws Throwable {
        Resource actual = DQV.resolveDimensionResource(null);

        assertThat(actual, is(nullValue()));
    }
}
