package no.acat.service;

import com.google.gson.Gson;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import java.io.IOException;
import java.util.Date;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class ApiDocumentBuilderServiceTest {

  ApiDocumentBuilderService spy;
  ApiRegistrationPublic apiRegistrationPublic;
  ElasticsearchService elasticsearchService;
  ApiDocument apiDocument;
  ParserService parserService;
  Date harvestDate;
  String spec;

  @Before
  public void setup() throws IOException, ParseException {
    MockitoAnnotations.initMocks(this);
    elasticsearchService = mock(ElasticsearchService.class);
    parserService = mock(ParserService.class);

    harvestDate = new DateTime(2018, 6, 20, 0, 0).toDate();
    spec = IOUtillity.getStringOutputFromFile("raw-enhet-api.json");
    apiRegistrationPublic = new ApiRegistrationPublic();
    apiRegistrationPublic.setApiSpec(spec);

    spy = spy(new ApiDocumentBuilderService(elasticsearchService, parserService));
  }

  @Test
  public void testGetApiSpecSuccess() throws IOException {

    ApiDocumentBuilderService spy =
        spy(new ApiDocumentBuilderService(elasticsearchService, parserService));

    String actual = spy.getApiSpec(apiRegistrationPublic);
    Assert.assertEquals(spec, actual);
  }

  @Test
  public void checkIfApiDocumentIsCreated() throws IOException, ParseException {

    ApiDocument actualApiDocument =
        spy.createFromApiRegistration(apiRegistrationPublic, null, harvestDate);
    Assert.assertNotNull(actualApiDocument);
    Mockito.verify(spy, Mockito.times(1)).getApiSpec(apiRegistrationPublic);
  }

  @Test
  public void checkIfIdIsCreated() throws IOException, ParseException {

    ApiDocumentBuilderService spy =
        spy(new ApiDocumentBuilderService(elasticsearchService, parserService));

    apiRegistrationPublic = new ApiRegistrationPublic();
    apiRegistrationPublic.setApiSpec(spec);

    ApiDocument actualApiDocument =
        spy.createFromApiRegistration(apiRegistrationPublic, null, harvestDate);
    Assert.assertNotNull(actualApiDocument.getId());
    Mockito.verify(spy, Mockito.times(1)).getApiSpec(apiRegistrationPublic);
  }

  @Test
  public void checkIfPopulateFromApiRegistrationIsCalledOnes() throws Exception {

    doNothing().when(spy).populateFromApiRegistration(any(), any());
    spy.populateFromApiRegistration(apiDocument, apiRegistrationPublic);

    Mockito.verify(spy, Mockito.times(1))
        .populateFromApiRegistration(apiDocument, apiRegistrationPublic);
  }

  @Test
  public void checkIfPopulateFromOpenApiIsCalledOnes() throws Exception {

    ApiDocument mockApiDocument = mock(ApiDocument.class);
    OpenAPI openApi = new Gson().fromJson(spec, OpenAPI.class);

    spy.populateFromOpenApi(mockApiDocument, openApi);

    Mockito.verify(spy, Mockito.times(1)).populateFromOpenApi(mockApiDocument, openApi);
  }

  @Test
  public void checkIfUpdateHarvestMetadataIsCalledOnes() throws Exception {

    ApiDocument mockApiDocument = mock(ApiDocument.class);
    spy.updateHarvestMetadata(mockApiDocument, harvestDate, mockApiDocument);

    Mockito.verify(spy, Mockito.times(1))
        .updateHarvestMetadata(mockApiDocument, harvestDate, mockApiDocument);
  }
}
