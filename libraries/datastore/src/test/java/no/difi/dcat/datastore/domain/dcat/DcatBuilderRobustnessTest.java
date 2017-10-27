package no.difi.dcat.datastore.domain.dcat;

import no.dcat.shared.Catalog;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.difi.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

public class DcatBuilderRobustnessTest {

    static Logger logger = LoggerFactory.getLogger(DcatBuilderRobustnessTest.class);

    DcatBuilder builder;

    @Before
    public void setUp() {
        builder = new DcatBuilder();
    }


    @Test
    public void convertCompleteCatalogToTurtleOK() throws Throwable {

        Catalog catalog = TestCompleteCatalog.getCompleteCatalog();

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        logger.info("");

    }
}
