package no.fdk.acat.converters.apispecificationparser;

import io.swagger.v3.oas.models.OpenAPI;
import no.fdk.test.testcategories.UnitTest;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Category(UnitTest.class)
public class OpenApiV3JsonParserTest {

    private final OpenApiV3JsonParser openApiV3JsonParser = new OpenApiV3JsonParser();

    private String spec;

    @Before
    public void setup() throws IOException {
        spec = IOUtils.toString(new ClassPathResource("enhetsregisteret-openapi3.json").getInputStream(), "UTF-8");
    }

    @Test
    public void CanParse_ShouldReturnTrue() {
        boolean result = openApiV3JsonParser.canParse(spec);
        Assert.assertTrue(result);
    }

    @Test
    public void ParseToOpenAPI_ShouldParse() throws Exception {
        OpenAPI parsed = openApiV3JsonParser.parseToOpenAPI(spec);
        Assert.assertEquals(parsed.getInfo().getTitle(), "Åpne Data fra Enhetsregisteret - API Dokumentasjon");
    }

    @Test
    public void Parse_ShouldParse() throws Exception {
        ApiSpecification parsed = openApiV3JsonParser.parse(spec);
        Assert.assertEquals(parsed.getInfo().getTitle(), "Åpne Data fra Enhetsregisteret - API Dokumentasjon");
    }

    @Test
    public void Parse_ShouldExtractFormats() throws Exception {
        ApiSpecification parsed = openApiV3JsonParser.parse(spec);
        Assert.assertEquals(parsed.getFormats().size(), 3);
        Assert.assertEquals(parsed.getFormats().toArray()[0], "application/json");
    }


}
