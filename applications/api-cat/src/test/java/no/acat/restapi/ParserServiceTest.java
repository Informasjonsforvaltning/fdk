package no.acat.restapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import no.acat.service.ParserService;
import no.acat.utils.Utils;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ParserServiceTest {

    private static Logger logger = LoggerFactory.getLogger(ParserServiceTest.class);

    @Test
    public void readAndCheckUtf8() throws Throwable {
        ClassPathResource resource = new ClassPathResource("raw-enhet-api.json");

        String resourceUrl = resource.getURL().toString();

        logger.info("open url: {}", resourceUrl);
        ObjectMapper mapper = Utils.jsonMapper();
        ParserService parserService = new ParserService(mapper);

        String spec = IOUtils.toString(resource.getInputStream(), "UTF-8");

        OpenAPI openApi = parserService.parse(spec);

        assertThat(openApi.getInfo().getTitle(), is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
        assertThat(openApi.getInfo().getContact().getName(), is("Forenkling og Brukerdialog hos Brønnøysundregistrene"));
    }

    @Test
    @Ignore
    public void parse_v3_0_1_as_v3_0_0_SpecWithInvalidAdditionalProperties() throws Throwable {
        ClassPathResource resource = new ClassPathResource("api-cat-invalid-additionalproperties.json");

        ObjectMapper mapper = Utils.jsonMapper();
        ParserService parserService = new ParserService(mapper);

        String spec = IOUtils.toString(resource.getInputStream(), "UTF-8");

        OpenAPI openApi = parserService.parse(spec);

        assertThat(openApi.getInfo().getTitle(), is("National API Directory Search API"));
    }


}
