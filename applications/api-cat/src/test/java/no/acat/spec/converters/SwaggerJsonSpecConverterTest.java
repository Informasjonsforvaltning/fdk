package no.acat.spec.converters;

import io.swagger.v3.oas.models.OpenAPI;
import no.acat.utils.IOUtillity;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@RunWith(PowerMockRunner.class)
@Category(UnitTest.class)
public class SwaggerJsonSpecConverterTest {

  private static Logger logger = LoggerFactory.getLogger(SwaggerJsonSpecConverterTest.class);

  SwaggerJsonSpecConverter swaggerJsonSpecConverter;
  ClassPathResource resource;
  String spec;

  @Before
  public void setup() throws IOException {
    MockitoAnnotations.initMocks(this);
    spec = IOUtillity.getStringOutputFromFile("swagger-raw-enhet-api.json");
  }

  @PrepareForTest({SwaggerJsonSpecConverter.class})
  @Test
  public void test_if_canConvert() throws Exception {

    PowerMockito.mockStatic(SwaggerJsonSpecConverter.class);
    PowerMockito.doCallRealMethod()
        .when(SwaggerJsonSpecConverter.class, "canConvert", Mockito.any(String.class));

    boolean convert = SwaggerJsonSpecConverter.canConvert(spec);

    Assert.assertTrue(convert);
  }

  @PrepareForTest({SwaggerJsonSpecConverter.class})
  @Test
  public void test_if_can_parse() throws Exception {

    PowerMockito.mockStatic(SwaggerJsonSpecConverter.class);
    PowerMockito.doCallRealMethod()
        .when(SwaggerJsonSpecConverter.class, "convert", Mockito.any(String.class));

    OpenAPI parse = SwaggerJsonSpecConverter.convert(spec);

    Assert.assertTrue(parse.getInfo().getTitle().equals("FS-API"));
  }
}
