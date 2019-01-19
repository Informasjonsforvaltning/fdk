package no.fdk.acat.converters.apispecificationparser;

import no.dcat.shared.testcategories.UnitTest;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Category(UnitTest.class)
public class UniversalParserTest {

    private final Parser parser = new UniversalParser();

    @Test
    public void CanParse_WhenSwagger_ShouldReturnTrue() throws IOException {
        String spec = IOUtils.toString(new ClassPathResource("fs-api-swagger.json").getInputStream(), "UTF-8");
        boolean result = parser.canParse(spec);
        Assert.assertTrue(result);
    }

    @Test
    public void CanParse_WhenOpenApi_ShouldReturnTrue() throws IOException {
        String spec = IOUtils.toString(new ClassPathResource("enhetsregisteret-openapi3.json").getInputStream(), "UTF-8");
        boolean result = parser.canParse(spec);
        Assert.assertTrue(result);
    }

    @Test
    public void Parse_WhenSwagger_ShouldParse() throws Exception {
        String spec = IOUtils.toString(new ClassPathResource("fs-api-swagger.json").getInputStream(), "UTF-8");

        ApiSpecification parsed = parser.parse(spec);
        Assert.assertEquals("FS-API",parsed.getInfo().getTitle());
    }

    @Test
    public void Parse_WhenOpenApi_ShouldParse() throws Exception {
        String spec = IOUtils.toString(new ClassPathResource("enhetsregisteret-openapi3.json").getInputStream(), "UTF-8");

        ApiSpecification parsed = parser.parse(spec);
        Assert.assertEquals("Åpne Data fra Enhetsregisteret - API Dokumentasjon",parsed.getInfo().getTitle());
    }

}
