package no.acat.restapi;

import no.acat.service.ParserService;
import no.dcat.openapi.OpenAPI;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ParserServiceTest {

    @Test
    public void readAndCheckUtf8() throws Throwable {
        ClassPathResource resource = new ClassPathResource("raw-enhet-api.json");

        ParserService parserService = new ParserService();

        String spec = IOUtils.toString(resource.getInputStream(), "UTF-8");

        OpenAPI openApi = parserService.parse(spec);

        assertThat(openApi.getInfo().getTitle(), is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
        assertThat(openApi.getInfo().getContact().getName(), is("Forenkling og Brukerdialog hos Brønnøysundregistrene"));
    }

    @Test
    public void parse_v3_0_1_as_v3_0_0_SpecWithInvalidAdditionalProperties() throws Throwable {
        ClassPathResource resource = new ClassPathResource("api-cat-invalid-additionalproperties.json");

        ParserService parserService = new ParserService();

        String spec = IOUtils.toString(resource.getInputStream(), "UTF-8");

        OpenAPI openApi = parserService.parse(spec);

        assertThat(openApi.getInfo().getTitle(), is("National API Directory Search API"));
    }

}
