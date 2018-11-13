package no.acat.restapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.service.ParserService;
import no.acat.spec.ParseException;
import no.acat.utils.IOUtillity;
import no.acat.utils.Utils;
import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.webutils.exceptions.BadRequestException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import java.io.IOException;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Category(UnitTest.class)
public class ConvertControllerTest {

  ConvertResponse convertResponse;
  ConvertRequest convertRequest;
  String spec;
  @InjectMocks private ConvertController convertController;

  @Before
  public void setup() {

    MockitoAnnotations.initMocks(this);

    convertRequest = mock(ConvertRequest.class);
    convertResponse = mock(ConvertResponse.class);
  }

  @Test(expected = BadRequestException.class)
  public void test_convert_without_spec_should_failed() throws Exception {

    when(convertRequest.getSpec()).thenReturn(null);
    convertResponse = convertController.convert(convertRequest);
  }

  @Test
  public void check_if_we_return_responsebody_success()
      throws IOException, BadRequestException, ParseException {

    ObjectMapper mapper = Utils.jsonMapper();
    ParserService parserService = new ParserService(mapper);
    convertController = new ConvertController(parserService);
    spec = IOUtillity.getStringOutputFromFile("raw-enhet-api.json");
    convertRequest.setSpec(spec);
    when(convertRequest.getSpec()).thenReturn(spec);
    convertResponse = convertController.convert(convertRequest);
    Assert.assertEquals(
        convertResponse.getOpenApi().getInfo().getTitle(),
        "Åpne Data fra Enhetsregisteret - API Dokumentasjon");
  }

  @Test
  public void test_getting_spec_from_url_success() throws Exception {
    ObjectMapper mapper = Utils.jsonMapper();
    ParserService parserService = new ParserService(mapper);
    convertController = new ConvertController(parserService);
    convertRequest.setUrl("https://docker-demo.fsat.no/fsapi/swagger.json");
    when(convertRequest.getUrl()).thenReturn("https://docker-demo.fsat.no/fsapi/swagger.json");
    convertResponse = convertController.convert(convertRequest);
    Assert.assertEquals(convertResponse.getOpenApi().getInfo().getTitle(), "FS-API");
  }

  @Test(expected = BadRequestException.class)
  public void check_if_downloading_spec_failed() throws Exception {
    ObjectMapper mapper = Utils.jsonMapper();
    ParserService parserService = new ParserService(mapper);
    convertController = new ConvertController(parserService);
    convertRequest.setUrl("https://fake.url");
    when(convertRequest.getUrl()).thenReturn("https://fake.url");
    convertResponse = convertController.convert(convertRequest);
  }
}
