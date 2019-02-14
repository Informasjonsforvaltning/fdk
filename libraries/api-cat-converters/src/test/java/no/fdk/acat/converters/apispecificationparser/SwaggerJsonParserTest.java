package no.fdk.acat.converters.apispecificationparser;

import io.swagger.v3.oas.models.OpenAPI;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import no.fdk.test.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Category(UnitTest.class)
public class SwaggerJsonParserTest {

    private final SwaggerJsonParser swaggerJsonParser = new SwaggerJsonParser();

    private String spec;
    private String invalidSpec;

    @Before
    public void setup() throws IOException {
        spec = IOUtils.toString(new ClassPathResource("fs-api-swagger.json").getInputStream(), "UTF-8");
        invalidSpec = IOUtils.toString(new ClassPathResource("fs-api-swagger-invalid-missing-description.json").getInputStream(), "UTF-8");
    }

    @Test
    public void CanParse_ShouldReturnTrue() {
        boolean result = swaggerJsonParser.canParse(spec);
        Assert.assertTrue(result);
    }

    @Test
    public void CanParse_ShouldReturnFalse() {
        boolean result = swaggerJsonParser.canParse(invalidSpec);
        Assert.assertFalse(result);
    }

    @Test
    public void ParseToOpenAPI_ShouldParse() throws Exception {
        OpenAPI parsed = swaggerJsonParser.parseToOpenAPI(spec);
        Assert.assertEquals(parsed.getInfo().getTitle(), "FS-API");
    }

    @Test
    public void Parse_ShouldParse() throws Exception {
        ApiSpecification parsed = swaggerJsonParser.parse(spec);
        Assert.assertEquals(parsed.getInfo().getTitle(), "FS-API");
    }
}
