package no.dcat.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import no.fdk.test.testcategories.UnitTest;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.lang.reflect.Type;
import java.util.Date;

@Category(UnitTest.class)
public class RegistrationSendsJsonTest {
    String datasetJson = "fail";

    @Test(expected = Exception.class)
    public void canMarsalReferenceWithGson() throws Throwable {
        JsonSerializer<Date> ser = new JsonSerializer<Date>() {
            @Override
            public JsonElement serialize(Date src, Type typeOfSrc, JsonSerializationContext
                context) {
                return src == null ? null : new JsonPrimitive(src.getTime());
            }
        };
        Dataset dataset = new GsonBuilder().setPrettyPrinting().registerTypeAdapter(Date.class, ser).create().fromJson(datasetJson, Dataset.class);
        Assert.assertThat(dataset, Matchers.is(Matchers.notNullValue()));
    }

    @Test(expected = Exception.class)
    public void canParseReferenceWithJackson() throws Throwable {
        ObjectMapper mapper = new ObjectMapper();
        Dataset dataset = mapper.readValue(datasetJson, Dataset.class);
        Assert.assertThat(dataset, Matchers.is(Matchers.notNullValue()));
    }
}
