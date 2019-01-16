package no.fdk.acat.converters.apispecificationparser;

import io.swagger.v3.oas.models.OpenAPI;
import no.dcat.shared.testcategories.UnitTest;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
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

    @Before
    public void setup() throws IOException {
        spec = IOUtils.toString(new ClassPathResource("fsapi-swagger.json").getInputStream(), "UTF-8");
    }

    @Test
    public void CanParse_ShouldReturnTrue() {
        boolean result = swaggerJsonParser.canParse(spec);
        Assert.assertTrue(result);
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
