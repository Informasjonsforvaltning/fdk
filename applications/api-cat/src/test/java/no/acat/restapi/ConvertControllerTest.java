package no.acat.restapi;

import no.dcat.client.apicat.ConvertRequest;
import no.dcat.client.apicat.ConvertResponse;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.webutils.exceptions.BadRequestException;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Category(UnitTest.class)
public class ConvertControllerTest {

  ConvertResponse convertResponse;
  ConvertRequest convertRequest;
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
}
