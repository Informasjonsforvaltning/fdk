package no.acat.service;

import io.swagger.v3.oas.models.OpenAPI;
import no.acat.model.ApiDocument;
import no.acat.spec.ParseException;
import no.acat.utils.IOUtillity;
import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.shared.testcategories.UnitTest;
import org.joda.time.DateTime;
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

import java.io.IOException;
import java.util.Date;

import static org.mockito.Mockito.any;

@RunWith(PowerMockRunner.class)
@PrepareForTest(ApiDocumentBuilderService.class)
@Category(UnitTest.class)
public class ApiDocumentBuilderServiceTest {

  ApiDocumentBuilderService spy;
  ApiRegistrationPublic apiRegistrationPublic;
  ElasticsearchService elasticsearchService;
  ApiDocument apiDocument;
  OpenAPI openApi;
  ParserService parserService;
  Date harvestDate;
  String spec;

  @Before
  public void setup() throws IOException, ParseException {
    MockitoAnnotations.initMocks(this);
    elasticsearchService = PowerMockito.mock(ElasticsearchService.class);
    parserService = PowerMockito.mock(ParserService.class);

    harvestDate = new DateTime(2018, 6, 20, 0, 0).toDate();

    spec = IOUtillity.getStringOutputFromFile("raw-enhet-api.json");
    apiRegistrationPublic = new ApiRegistrationPublic();
    apiRegistrationPublic.setApiSpec(spec);

    spy = PowerMockito.spy(new ApiDocumentBuilderService(elasticsearchService, parserService));

    PowerMockito.when(parserService.parse(spec)).thenReturn(null);
    PowerMockito.doNothing().when(spy).populateFromApiRegistration(any(), any());
    PowerMockito.doNothing().when(spy).populateFromOpenApi(any(), any());
    PowerMockito.doNothing()
        .when(spy)
        .updateHarvestMetadata(any(ApiDocument.class), any(Date.class), any(ApiDocument.class));
  }

  @Test
  public void test_get_api_spec_success() throws IOException {

    ApiDocumentBuilderService spy =
        PowerMockito.spy(new ApiDocumentBuilderService(elasticsearchService, parserService));

    String actual = spy.getApiSpec(apiRegistrationPublic);
    Assert.assertEquals(spec, actual);
    Mockito.verify(spy, Mockito.times(1)).getApiSpec(apiRegistrationPublic);
  }

  @Test
  public void check_if_apidocument_is_created() throws IOException, ParseException {

    ApiDocument actualApiDocument =
        spy.createFromApiRegistration(apiRegistrationPublic, null, harvestDate);
    Assert.assertNotNull(actualApiDocument);
    Mockito.verify(spy, Mockito.times(1)).getApiSpec(apiRegistrationPublic);
  }

  @Test
  public void check_if_id_is_created() throws IOException, ParseException {

    ApiDocumentBuilderService spy =
        PowerMockito.spy(new ApiDocumentBuilderService(elasticsearchService, parserService));

    apiRegistrationPublic = new ApiRegistrationPublic();
    apiRegistrationPublic.setApiSpec(spec);

    ApiDocument actualApiDocument =
        spy.createFromApiRegistration(apiRegistrationPublic, null, harvestDate);
    Assert.assertNotNull(actualApiDocument.getId());
    Mockito.verify(spy, Mockito.times(1)).getApiSpec(apiRegistrationPublic);
  }

  @Test
  public void check_if_populate_from_apiregistration_is_called_ones() throws Exception {

    spy.populateFromApiRegistration(apiDocument, apiRegistrationPublic);

    Mockito.verify(spy, Mockito.times(1))
        .populateFromApiRegistration(apiDocument, apiRegistrationPublic);
  }

  @Test
  public void check_if_populate_from_openapi_is_called_ones() throws Exception {

    spy.populateFromOpenApi(apiDocument, openApi);

    Mockito.verify(spy, Mockito.times(1)).populateFromOpenApi(apiDocument, openApi);
  }

  @Test
  public void check_if_update_harvest_metadata_is_called_ones() throws Exception {

    ApiDocument mockApiDocument = PowerMockito.mock(ApiDocument.class);
    spy.updateHarvestMetadata(mockApiDocument, harvestDate, mockApiDocument);

    Mockito.verify(spy, Mockito.times(1))
        .updateHarvestMetadata(mockApiDocument, harvestDate, mockApiDocument);
  }
}
