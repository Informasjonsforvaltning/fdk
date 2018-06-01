package no.dcat.validation.model;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

/**
 * Created by dask on 05.05.2017.
 */
@Category(UnitTest.class)
public class PropertyTest {

    @Test
    public void construktor1() throws Throwable {
        Property property = new Property("name", "rule", "OK", "No message");

        assertThat(property.getName(), is("name"));
        assertThat(property.getMessage(), is("No message"));
        assertThat(property.getRule(), is("rule"));
        assertThat(property.getSeverity(), is("OK"));
    }

    @Test
    public void constructor2() throws Throwable {
        Property property = new Property("name", "rule");

        assertThat(property.getName(), is("name"));
        assertThat(property.getMessage(), is(nullValue()));
        assertThat(property.getRule(), is("rule"));
        assertThat(property.getSeverity(), is(Property.OK));
    }

    @Test
    public void compareTest () throws  Throwable {
        Property property1 = new Property("name", "rule", "OK", "No message");
        Property property2 = new Property("name", "rule", "OK", "No message");

        assertThat(property1.equals(property2), is(true));
        assertThat(property1, is(property2));
    }
}
