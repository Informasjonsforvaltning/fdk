package no.acat.restapi;

import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ConvertControllerTest {

    private static Logger logger = LoggerFactory.getLogger(ConvertControllerTest.class);

    @Test
    public void readAndCheckUtf8() throws Throwable {
        ClassPathResource resource = new ClassPathResource("raw-enhet-api.json");

        String resourceUrl = resource.getURL().toString();

        logger.info("open url: {}", resourceUrl);

        ConvertController controller = new ConvertController();

        ConvertRequest request = ConvertRequest.builder().spec(IOUtils.toString(resource.getInputStream(),"UTF-8")).build();

        //logger.info("request: {}",request);

        ConvertResponse response = controller.convert(request);

        logger.info("response: {}",response);

        assertThat(response.getOpenApi().getInfo().getTitle(), is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
        assertThat(response.getOpenApi().getInfo().getContact().getName(), is("Forenkling og Brukerdialog hos Brønnøysundregistrene"));
    }

}
