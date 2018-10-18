package no.acat.harvester;

import com.google.gson.Gson;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.dcat.client.apiregistration.ApiRegistrationClient;
import no.dcat.client.apiregistration.ApiRegistrationPublic;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
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
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyObject;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

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
    when(mockApiDocumentBuilder.create(any())).thenReturn(new ApiDocument());

    doReturn(new ArrayList<ApiDocument>()).when(spyHarvester).getRegisteredApis();
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

    doReturn(apiDocumentsList).when(spyHarvester).getRegisteredApis();
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

    doReturn(apiDocumentsList).when(spyHarvester).getRegisteredApis();

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

    doReturn(apiDocumentsList).when(spyHarvester).getRegisteredApis();
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);

    doNothing().when(spyHarvester).doBulkIndex(anyObject());

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

    @Test
    public void testGetRegisteredApisLogic() throws Throwable {

        ElasticsearchService elasticsearchService = mock(ElasticsearchService.class);
        ApiHarvester harvester = new ApiHarvester(elasticsearchService);
        ApiHarvester harvesterSpy = spy(harvester);

        ClassPathResource bhf = new ClassPathResource("navneprod-api.json");

        ApiRegistrationPublic api = new Gson().fromJson(IOUtils.toString(bhf.getInputStream(), "UTF-8"), ApiRegistrationPublic.class);
        Collection<ApiRegistrationPublic> apis = new ArrayList<>();
        apis.add(api);

        ApiRegistrationClient mockApiRegistrationClient = mock(ApiRegistrationClient.class);
        when(mockApiRegistrationClient.getPublished()).thenReturn(apis);

        doReturn(mockApiRegistrationClient).when(harvesterSpy).initApiRegistrationClient();

        // test
        List<ApiDocument> actualDocuments = harvesterSpy.getRegisteredApis();

        assertThat(actualDocuments.size(), is(1));
        ApiDocument document = actualDocuments.get(0);

        assertThat("title is mapped from openapi.info.title", document.getTitle(), is("Echo API"));
        assertThat("html is stripped off", document.getDescription(), is("Dette er en fin beskrivelse."));
        assertThat("safe html is kept in formated", document.getDescriptionFormatted(), is("<strong>Dette</strong> er en fin beskrivelse."));
    }

}
