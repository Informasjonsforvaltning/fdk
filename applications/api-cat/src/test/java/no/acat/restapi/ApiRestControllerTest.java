package no.acat.restapi;

import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.acat.utils.Utils;
import no.dcat.shared.testcategories.UnitTest;
import no.dcat.webutils.exceptions.NotFoundException;
import org.elasticsearch.action.get.GetRequestBuilder;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.Client;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.rules.ExpectedException;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;

import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class ApiRestControllerTest {

  private final String lookupJson = "{\"id\":\"c23c14c6-63c4-40f4-bae4-2d40198a2f40\"}";
  private final String id = "c23c14c6-63c4-40f4-bae4-2d40198a2f40";

  @Rule public ExpectedException thrown = ExpectedException.none();
  ElasticsearchService elasticsearchService;
  Client client;
  GetResponse response;
  GetRequestBuilder builder;
  @Autowired private MockMvc mvc;
  @Spy @InjectMocks private ApiRestController controller;

  @Before
  public void setup() {
    elasticsearchService = mock(ElasticsearchService.class);
    client = mock(Client.class);
    response = mock(GetResponse.class);
    builder = mock(GetRequestBuilder.class);
  }

  @Test
  public void test_getApiDocument_if_with_id_return_success() throws Exception {

    controller = new ApiRestController(elasticsearchService, Utils.jsonMapper());

    when(elasticsearchService.getClient()).thenReturn(client);
    when(client.prepareGet(anyString(), anyString(), anyString())).thenReturn(builder);
    when(builder.get()).thenReturn(response);
    when(response.isExists()).thenReturn(true);
    when(response.getSourceAsString()).thenReturn(lookupJson);

    ApiDocument apiDocument = controller.getApiDocument(id);

    Assert.assertEquals(id, apiDocument.getId());
  }

  @Test(expected = NotFoundException.class)
  public void test_id_getresponse_not_exists_and_should_failed() throws NotFoundException, IOException {

    controller = new ApiRestController(elasticsearchService, Utils.jsonMapper());

    when(elasticsearchService.getClient()).thenReturn(client);
    when(client.prepareGet(anyString(), anyString(), anyString())).thenReturn(builder);
    when(builder.get()).thenReturn(response);
    when(response.isExists()).thenReturn(false);
    when(response.getSourceAsString()).thenReturn(lookupJson);

    controller.getApiDocument(id);
  }
}
