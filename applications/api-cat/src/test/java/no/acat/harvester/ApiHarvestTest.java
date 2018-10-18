package no.acat.harvester;

import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.bulk.BulkAction;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.ElasticsearchClient;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ApiHarvestTest {

  @Mock ElasticsearchService mockElasticsearchService;
  @Mock ElasticsearchClient mockElasticsearchClient;
  @Mock Client client;
  @Mock BulkAction mockBulkAction;
  @Mock ApiCatalogRecord mockApiCatalogRecord;
  @Mock BulkRequestBuilder bulkRequestBuilder;

  @Before
  public void prepare() {
    MockitoAnnotations.initMocks(this);

    bulkRequestBuilder = new BulkRequestBuilder(mockElasticsearchClient, mockBulkAction);
  }

  @Test
  public void harvestAllOK() throws Throwable {

    ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
    ApiHarvester harvester = new ApiHarvester(elasticsearchService);

    ApiHarvester spyHarvester = spy(harvester);
    doNothing().when(spyHarvester).indexApis(any());

    ApiDocumentBuilder mockApiDocumentBuilder = mock(ApiDocumentBuilder.class);
    doReturn(new ApiDocument()).when(mockApiDocumentBuilder).create(any());

    doReturn(mockApiDocumentBuilder).when(spyHarvester).createApiDocumentBuilder();

    List<ApiDocument> response = spyHarvester.harvestAll();
    final int FROM_CSV = 11;
    assertThat(response.size(), is(FROM_CSV));
  }

  @Test
  public void harvestAllMerge() throws Throwable {

    ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
    ApiHarvester harvester = new ApiHarvester(elasticsearchService);

    ApiHarvester spyHarvester = spy(harvester);
    doNothing().when(spyHarvester).indexApis(any());

    ApiDocumentBuilder mockApiDocumentBuilder = mock(ApiDocumentBuilder.class);

    doReturn(new ApiDocument()).when(mockApiDocumentBuilder).create(any());
    doReturn(mockApiDocumentBuilder).when(spyHarvester).createApiDocumentBuilder();

    List<ApiDocument> apiDocumentsList = apiDocumentTestData();

    when(spyHarvester.getRegisteredApis()).thenReturn(apiDocumentsList);
    List<ApiDocument> response = spyHarvester.harvestAll();
    final int FROM_CSV = 11;
    final int FROM_REGAPI = 1;
    assertThat(response.size(), is(FROM_CSV + FROM_REGAPI));
  }

  @Test
  public void harvestAllRemove() throws Throwable {

    ApiHarvester harvester = new ApiHarvester(mockElasticsearchService);
    ApiHarvester spyHarvester = spy(harvester);
    ApiDocumentBuilder mockApiDocumentBuilder = mock(ApiDocumentBuilder.class);

    doNothing().when(spyHarvester).indexApis(any());
    doReturn(new ApiDocument()).when(mockApiDocumentBuilder).create(any());
    doReturn(mockApiDocumentBuilder).when(spyHarvester).createApiDocumentBuilder();

    ApiDocument apiDocumentFromCSV = mockApiDocumentBuilder.create(mockApiCatalogRecord);
    apiDocumentFromCSV.setApiDocUrl("https://github.com/Informasjonsforvaltning/fdk");

    when(mockApiDocumentBuilder.create(mockApiCatalogRecord)).thenReturn(apiDocumentFromCSV);

    List<ApiDocument> apiDocumentsList = apiDocumentTestData();

    when(spyHarvester.getRegisteredApis()).thenReturn(apiDocumentsList);

    List<ApiDocument> response = spyHarvester.harvestAll();
    final int FROM_CSV = 0;
    final int FROM_REGAPI = 1;
    assertThat(response.size(), is(FROM_CSV + FROM_REGAPI));
  }

  @Test
  public void indexApis() throws Throwable {

    when(mockElasticsearchService.getClient()).thenReturn(client);
    ApiHarvester harvester = new ApiHarvester(mockElasticsearchService);
    ApiHarvester spyHarvester = spy(harvester);
    ApiDocumentBuilder mockApiDocumentBuilder = mock(ApiDocumentBuilder.class);

    doReturn(new ApiDocument()).when(mockApiDocumentBuilder).create(any());
    doReturn(mockApiDocumentBuilder).when(spyHarvester).createApiDocumentBuilder();

    List<ApiDocument> apiDocumentsList = apiDocumentTestData();

    when(spyHarvester.getRegisteredApis()).thenReturn(apiDocumentsList);
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);

    doNothing().when(spyHarvester).doBuilkIndex(anyObject());

    spyHarvester.harvestAll();

    assertEquals(bulkRequestBuilder.request().requests().size(), 12);
  }

  private List<ApiDocument> apiDocumentTestData() {
    List<ApiDocument> apiDocumentsList = new ArrayList<>();
    ApiDocument apiDocument = new ApiDocument();
    apiDocument.setId("1234");
    apiDocument.setApiDocUrl("https://github.com/Informasjonsforvaltning/fdk");
    apiDocument.setNationalComponent(false);
    apiDocument.setDatasetReferences(null);
    apiDocumentsList.add(apiDocument);
    return apiDocumentsList;
  }
}
