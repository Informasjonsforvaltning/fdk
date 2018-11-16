package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.acat.utils.IOUtillity;
import no.acat.utils.Utils;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsRequestBuilder;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.AdminClient;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
@RunWith(SpringRunner.class)
public class ElasticsearchServiceTest {

  ElasticsearchService elasticsearchService;
  String spec;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);
    elasticsearchService = mock(ElasticsearchService.class);
  }

  @Test
  public void testIfGetClientReturnNotNull() {
    ObjectMapper mapper = Utils.jsonMapper();
    Client client = mock(Client.class);
    Elasticsearch5Client mockElasticsearch5Client = mock(Elasticsearch5Client.class);
    Elasticsearch5Client spyElasticsearch5Client =
        spy(new Elasticsearch5Client("elasticsearch5", "elasticsearch"));

    ElasticsearchService spyElasticsearchService =
        spy(
            new ElasticsearchService(
                mapper, spyElasticsearch5Client, "elasticsearch5", "elasticsearch"));
    doReturn(client).when(mockElasticsearch5Client).getClient();
    doNothing().when(spyElasticsearchService).initializeElasticsearchTransportClient();

    when(spyElasticsearchService.getClient()).thenCallRealMethod();
    Client actual = spyElasticsearchService.getClient();

    Assert.assertThat(actual, is(notNullValue()));
  }

  @Test
  public void verifyInitializeElasticsearchTransportClientIfElasticsearchIsNull() {

    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    spyElasticsearchService.initializeElasticsearchTransportClient();

    verify(spyElasticsearchService, times(1)).initializeElasticsearchTransportClient();
  }

  @Test(expected = NullPointerException.class)
  public void shouldFailIfElasticsearchIsNullAndClusterNodesIsNull() {
    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, null, "elasticsearch"));

    spyElasticsearchService.initializeElasticsearchTransportClient();
  }

  @Test
  public void testIfApiDocumentIdsNotHarvested() throws IOException {

    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));
    List<String> ids = new ArrayList<>();

    String[] idsArray = ids.toArray(new String[0]);
    QueryBuilder harvestedQuery = QueryBuilders.idsQuery("apidocument").addIds(idsArray);
    QueryBuilder notHarvestedQuery = QueryBuilders.boolQuery().mustNot(harvestedQuery);

    SearchResponse response = mock(SearchResponse.class);
    Client client = mock(Client.class);
    SearchRequestBuilder builder = mock(SearchRequestBuilder.class);

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareSearch("acat")).thenReturn(builder);
    when(builder.setTypes("apidocument")).thenReturn(builder);
    when(builder.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)).thenReturn(builder);
    when(builder.setQuery(notHarvestedQuery)).thenReturn(builder);
    when(builder.setFetchSource(new String[] {"id", "harvest.lastHarvested"}, null))
        .thenReturn(builder);
    when(builder.get()).thenReturn(response);

    SearchHits hits = mock(SearchHits.class);
    SearchHit hit = mock(SearchHit.class);
    when(hit.getId()).thenReturn("1");
    SearchHit[] shits = {hit};

    when(response.getHits()).thenReturn(hits);
    when(response.getHits().getHits()).thenReturn(shits);

    List<String> idsNotHarvested = spyElasticsearchService.getApiDocumentIdsNotHarvested(ids);

    Assert.assertThat(idsNotHarvested.get(0), is("1"));
  }

  @Test(expected = RuntimeException.class)
  public void verifyIfCreateOrReplaceApiDocumentFailed() throws IOException {

    ObjectMapper mapper = Utils.jsonMapper();
    spec = IOUtillity.getStringOutputFromFile("raw-enhet-api.json");

    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    Client client = mock(Client.class);
    BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);

    BulkResponse bulkResponse = mock(BulkResponse.class);
    ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);

    ApiDocument apiDocument = new ApiDocument();

    IndexRequest spyIndexRequest = spy(new IndexRequest("acat", "apidocument", "10"));

    when(spyIndexRequest.source(spec)).thenReturn(spyIndexRequest);
    when(bulkRequestBuilder.add(spyIndexRequest)).thenReturn(bulkRequestBuilder);
    when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
    when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
    when(bulkResponse.hasFailures()).thenReturn(true);

    spyElasticsearchService.createOrReplaceApiDocument(apiDocument);

    verify(spyElasticsearchService, times(1)).createOrReplaceApiDocument(apiDocument);
  }

  @Test
  public void verifyIfCreateOrReplaceApiDocumentSuccess() throws IOException {

    ObjectMapper mapper = Utils.jsonMapper();
    spec = IOUtillity.getStringOutputFromFile("raw-enhet-api.json");

    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    Client client = mock(Client.class);
    BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);

    BulkResponse bulkResponse = mock(BulkResponse.class);
    ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);

    ApiDocument apiDocument = new ApiDocument();

    IndexRequest spyIndexRequest = spy(new IndexRequest("acat", "apidocument", "10"));

    when(spyIndexRequest.source(spec)).thenReturn(spyIndexRequest);
    when(bulkRequestBuilder.add(spyIndexRequest)).thenReturn(bulkRequestBuilder);
    when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
    when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
    when(bulkResponse.hasFailures()).thenReturn(false);

    spyElasticsearchService.createOrReplaceApiDocument(apiDocument);

    verify(spyElasticsearchService, times(1)).createOrReplaceApiDocument(apiDocument);
  }

  @Test
  public void verifyGetApiDocumentByHarvestSourceUri() {
    String harvestSourceUri = "";
    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    Client client = mock(Client.class);
    SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
    SearchResponse response = mock(SearchResponse.class);
    QueryBuilder harvestSourceUriQuery =
        QueryBuilders.termQuery("harvestSourceUri", harvestSourceUri);

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareSearch("acat")).thenReturn(builder);
    when(builder.setTypes("apidocument")).thenReturn(builder);
    when(builder.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)).thenReturn(builder);
    when(builder.setQuery(harvestSourceUriQuery)).thenReturn(builder);
    when(builder.get()).thenReturn(response);

    SearchHits hits = mock(SearchHits.class);
    SearchHit hit = mock(SearchHit.class);
    when(hit.getId()).thenReturn("1");
    SearchHit[] shits = {hit};

    when(response.getHits()).thenReturn(hits);
    when(response.getHits().getHits()).thenReturn(shits);

    /** todo test harvestSourceUri should not be empty */
    ApiDocument apiDocument =
        spyElasticsearchService.getApiDocumentByHarvestSourceUri(harvestSourceUri);

    verify(spyElasticsearchService, times(1)).getApiDocumentByHarvestSourceUri("");
  }

  @Test
  public void verifyIfDeleteApiDocumentByIdsSuccess() {
    List<String> ids = new ArrayList<>();
    ids.add("1");
    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    BulkResponse bulkResponse = mock(BulkResponse.class);
    ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);
    Client client = mock(Client.class);
    BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
    DeleteRequest request = new DeleteRequest("acat", "apidocument", ids.get(0));

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
    when(bulkRequestBuilder.add(request)).thenReturn(bulkRequestBuilder);

    when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
    when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);

    spyElasticsearchService.deleteApiDocumentByIds(ids);

    verify(spyElasticsearchService, times(1)).deleteApiDocumentByIds(ids);
  }

  @Test(expected = RuntimeException.class)
  public void verifyIfDeleteApiDocumentByIdsFailed() {
    List<String> ids = new ArrayList<>();
    ids.add("1");

    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    BulkResponse bulkResponse = mock(BulkResponse.class);
    ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);
    Client client = mock(Client.class);
    BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
    DeleteRequest request = new DeleteRequest("acat", "apidocument", ids.get(0));

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
    when(bulkRequestBuilder.add(request)).thenReturn(bulkRequestBuilder);

    when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
    when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
    when(bulkResponse.hasFailures()).thenReturn(true);

    spyElasticsearchService.deleteApiDocumentByIds(ids);

    verify(spyElasticsearchService, times(1)).deleteApiDocumentByIds(ids);
  }

  @Test
  public void verifyCreateIndexIfNotExists() {
    ObjectMapper mapper = Utils.jsonMapper();
    ElasticsearchService spyElasticsearchService =
        spy(new ElasticsearchService(mapper, null, "elasticsearch5", "elasticsearch"));

    BulkResponse bulkResponse = mock(BulkResponse.class);
    Client client = mock(Client.class);
    AdminClient adminClient = mock(AdminClient.class);
    IndicesAdminClient indicesAdminClient = mock(IndicesAdminClient.class);
    IndicesExistsRequestBuilder indicesExistsRequestBuilder =
        mock(IndicesExistsRequestBuilder.class);
    ListenableActionFuture<IndicesExistsResponse> listenableActionFuture =
        mock(ListenableActionFuture.class);
    IndicesExistsResponse indicesExistsResponse = mock(IndicesExistsResponse.class);
    CreateIndexRequestBuilder createIndexRequestBuilder = mock(CreateIndexRequestBuilder.class);
    ListenableActionFuture<CreateIndexResponse> createIndexResponseListenableActionFuture =
        mock(ListenableActionFuture.class);
    CreateIndexResponse createIndexResponse = mock(CreateIndexResponse.class);

    when(spyElasticsearchService.getClient()).thenReturn(client);
    when(client.admin()).thenReturn(adminClient);
    when(adminClient.indices()).thenReturn(indicesAdminClient);
    when(indicesAdminClient.prepareExists("acat")).thenReturn(indicesExistsRequestBuilder);
    when(indicesExistsRequestBuilder.execute()).thenReturn(listenableActionFuture);
    when(listenableActionFuture.actionGet()).thenReturn(indicesExistsResponse);
    when(indicesExistsResponse.isExists()).thenReturn(false);

    when(indicesAdminClient.prepareCreate("acat")).thenReturn(createIndexRequestBuilder);
    when(createIndexRequestBuilder.setSettings(anyString())).thenReturn(createIndexRequestBuilder);
    when(createIndexRequestBuilder.addMapping(anyString(), anyString()))
        .thenReturn(createIndexRequestBuilder);
    when(createIndexRequestBuilder.execute()).thenReturn(createIndexResponseListenableActionFuture);
    when(createIndexResponseListenableActionFuture.actionGet()).thenReturn(createIndexResponse);

    spyElasticsearchService.createIndexIfNotExists();

    verify(spyElasticsearchService, times(1)).createIndexIfNotExists();
  }

  @Test
  public void verifyIfValidate() {
    ObjectMapper mapper = Utils.jsonMapper();
    Elasticsearch5Client spyElasticsearch5Client =
        spy(new Elasticsearch5Client("elasticsearch5", "elasticsearch"));

    ElasticsearchService spyElasticsearchService =
        spy(
            new ElasticsearchService(
                mapper, spyElasticsearch5Client, "elasticsearch5", "elasticsearch"));

    doNothing().when(spyElasticsearchService).initializeElasticsearchTransportClient();
    doNothing().when(spyElasticsearchService).createIndexIfNotExists();

    spyElasticsearchService.validate();

    verify(spyElasticsearchService, times(1)).validate();
  }
}
