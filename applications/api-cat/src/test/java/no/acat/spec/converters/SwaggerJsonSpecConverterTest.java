package no.acat.spec.converters;

import io.swagger.v3.oas.models.OpenAPI;
import no.acat.utils.IOUtillity;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.powermock.modules.junit4.PowerMockRunner;

import java.io.IOException;

@RunWith(PowerMockRunner.class)
@Category(UnitTest.class)
public class SwaggerJsonSpecConverterTest {

  String spec;

  @Before
  public void setup() throws IOException {
    MockitoAnnotations.initMocks(this);
    spec = IOUtillity.getStringOutputFromFile("swagger-raw-enhet-api.json");
  }

  @Test
  public void test_if_canConvert() {

    boolean convert = SwaggerJsonSpecConverter.canConvert(spec);

    Assert.assertTrue(convert);
  }

  @Test
  public void test_if_can_parse() throws Exception {

    OpenAPI parse = SwaggerJsonSpecConverter.convert(spec);

    Assert.assertTrue(parse.getInfo().getTitle().equals("FS-API"));
  }
}
