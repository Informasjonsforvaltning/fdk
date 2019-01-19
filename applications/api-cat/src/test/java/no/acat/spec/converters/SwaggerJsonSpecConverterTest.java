package no.acat.spec.converters;

import io.swagger.v3.oas.models.OpenAPI;
import no.acat.utils.Utils;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.IOException;

@Category(UnitTest.class)
public class SwaggerJsonSpecConverterTest {

  String spec;

  @Before
  public void setup() throws IOException {
    spec = Utils.getStringFromResource("fs-api-swagger.json");
  }

  @Test
  public void testIfCanConvert() {

    boolean convert = SwaggerJsonSpecConverter.canConvert(spec);
    Assert.assertTrue(convert);
  }

  @Test
  public void testIfCanParse() throws Exception {

    OpenAPI parse = SwaggerJsonSpecConverter.convert(spec);
    Assert.assertEquals(parse.getInfo().getTitle(),"FS-API");
  }
}
