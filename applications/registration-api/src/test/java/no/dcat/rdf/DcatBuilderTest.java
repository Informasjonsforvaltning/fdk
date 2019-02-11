package no.dcat.rdf;

import com.google.gson.*;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.test.context.ActiveProfiles;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 12.04.2017.
 */
@ActiveProfiles(value = "develop")
@Category(UnitTest.class)
public class DcatBuilderTest {
    static Logger logger = LoggerFactory.getLogger(DcatBuilderTest.class);

    DcatBuilder builder;

    @Before
    public void setUp() {
        builder = new DcatBuilder();

    }


    @Test
    public void convertCompleteCatalogToTurtleOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = new Catalog();
        BeanUtils.copyProperties(TestCompleteCatalog.getCompleteCatalog(), catalog);

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        logger.debug("actual DCAT \n{}", actual);

    }


    @Test
    public void convertCompleteCatalogToJsonOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = new Catalog();
        BeanUtils.copyProperties(TestCompleteCatalog.getCompleteCatalog(), catalog);

        JsonSerializer<Date> ser = new JsonSerializer<Date>() {
            @Override
            public JsonElement serialize(Date src, Type typeOfSrc, JsonSerializationContext
                context) {
                return src == null ? null : new JsonPrimitive(src.getTime());
            }
        };
        //Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
        Gson gson = new GsonBuilder().registerTypeAdapter(Date.class, ser).setPrettyPrinting().create();

        String actual = gson.toJson(catalog);

        assertThat(actual, is(notNullValue()));
        logger.debug("{}", actual);
    }


    @Test
    public void convertMinimumCatalogOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = new Catalog();

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        logger.debug("mini catalog\n{}", actual);
    }

    @Test
    public void convertMinimumCatalogToTurtleOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = new Catalog();

        Dataset dataset = new Dataset();
        Map<String, String> title = new HashMap<>();
        title.put("nb", "minimum dataset");
        dataset.setTitle(title);
        dataset.setUri("http://uri/12345");

        catalog.setDataset(Arrays.asList(dataset));

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        logger.debug("miniimum catalog\n{}", actual);

    }

}
