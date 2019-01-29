package no.acat.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.acat.utils.Utils;
import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetRequestBuilder;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class ApiDocumentRepositoryTest {

    ApiDocumentRepository spyApiDocumentRepository;
    ElasticsearchService mockElasticsearchService;
    ObjectMapper mapper;

    @Before
    public void setup() throws IOException {

         mapper = mock(ObjectMapper.class);
         mockElasticsearchService = mock(ElasticsearchService.class);
         spyApiDocumentRepository = spy(new ApiDocumentRepository(mockElasticsearchService, mapper));

    }

    @Test
    public void checkIf_Count_ReturnOK(){
        SearchResponse searchResponse = mock(SearchResponse.class);
        Client client = mock(Client.class);
        SearchRequestBuilder searchRequestBuilder = mock(SearchRequestBuilder.class);

        when(mockElasticsearchService.getClient()).thenReturn(client);
        when(client.prepareSearch("acat")).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setTypes(anyString())).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setQuery(QueryBuilders.matchAllQuery())).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.setSize(anyInt())).thenReturn(searchRequestBuilder);
        when(searchRequestBuilder.get()).thenReturn(searchResponse);

        SearchHits hits = mock(SearchHits.class);
        when(searchResponse.getHits()).thenReturn(hits);
        when(hits.getTotalHits()).thenReturn(10L);

        doCallRealMethod().when(spyApiDocumentRepository).getCount();

        long count = spyApiDocumentRepository.getCount();

        Assert.assertEquals(10, count);

    }


    @Test
    public void checkIf_apiDocumentByHarvestSourceUri_hitsLengthIsOne_returnApiDocument(){

       String id = "1002";
       ApiDocument apiDocument = new ApiDocument();
       apiDocument.setId(id);
       SearchResponse searchResponse = mock(SearchResponse.class);
       Client client = mock(Client.class);
       SearchRequestBuilder searchRequestBuilder = mock(SearchRequestBuilder.class);

       when(mockElasticsearchService.getClient()).thenReturn(client);
       when(client.prepareSearch("acat")).thenReturn(searchRequestBuilder);
       when(searchRequestBuilder.setTypes(anyString())).thenReturn(searchRequestBuilder);
       when(searchRequestBuilder.setSearchType(SearchType.DFS_QUERY_THEN_FETCH)).thenReturn(searchRequestBuilder);
       when(searchRequestBuilder.setQuery(QueryBuilders.termQuery("harvestSourceUri", "harvestSourceUri"))).thenReturn(searchRequestBuilder);
       when(searchRequestBuilder.get()).thenReturn(searchResponse);

       SearchHits hits = mock(SearchHits.class);
       SearchHit hit = mock(SearchHit.class);
       SearchHit[] shits = {hit};

       when(searchResponse.getHits()).thenReturn(hits);
       when(hits.getHits()).thenReturn(shits);
       when(shits[0].getSourceAsString()).thenReturn("{\"id\":\"1002\"}");

       doCallRealMethod().when(spyApiDocumentRepository).getApiDocumentByHarvestSourceUri("harvestSourceUri");

       Optional<ApiDocument> expected = spyApiDocumentRepository.getApiDocumentByHarvestSourceUri("harvestSourceUri");

       Assert.assertThat(expected.get().getId(),  is(id));

   }


   @Test(expected = RuntimeException.class)
   public void checkIf_createOrReplaceApiDocument_hasFailures() throws IOException {

       String id = "1002";
       ApiDocument apiDocument = new ApiDocument();
       Client client = mock(Client.class);
       BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
       BulkResponse bulkResponse = mock(BulkResponse.class);
       ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

       when(mockElasticsearchService.getClient()).thenReturn(client);
       when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
       when(mapper.writeValueAsString(apiDocument)).thenReturn("{\"id\":\"1002\"}");
       when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
       when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
       when(bulkResponse.hasFailures()).thenReturn(true);

       doCallRealMethod().when(spyApiDocumentRepository).createOrReplaceApiDocument(apiDocument);

       spyApiDocumentRepository.createOrReplaceApiDocument(apiDocument);

   }

    @Test
    public void checkIf_createOrReplaceApiDocument_hasPassed() throws IOException {

        String id = "1002";
        ApiDocument apiDocument = new ApiDocument();
        Client client = mock(Client.class);
        BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
        BulkResponse bulkResponse = mock(BulkResponse.class);
        ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

        when(mockElasticsearchService.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
        when(mapper.writeValueAsString(apiDocument)).thenReturn("{\"id\":\"1002\"}");
        when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
        when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
        when(bulkResponse.hasFailures()).thenReturn(false);

        doCallRealMethod().when(spyApiDocumentRepository).createOrReplaceApiDocument(apiDocument);

        spyApiDocumentRepository.createOrReplaceApiDocument(apiDocument);

        verify(spyApiDocumentRepository, times(1)).createOrReplaceApiDocument(apiDocument);
    }

    @Test
    public void check_deleteApiDocumentByIds_IfIdsSize_IsZero(){

        List<String> ids = new ArrayList<>();

        doCallRealMethod().when(spyApiDocumentRepository).deleteApiDocumentByIds(anyList());

        spyApiDocumentRepository.deleteApiDocumentByIds(ids);

        Assert.assertTrue(ids.size() == 0);

    }

    @Test(expected = RuntimeException.class)
    public void checkIf_deleteApiDocumentByIds_hasFailures(){

        List<String> ids = new ArrayList<>();
        ids.add("1");
        Client client = mock(Client.class);
        BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
        BulkResponse bulkResponse = mock(BulkResponse.class);
        ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

        when(mockElasticsearchService.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
        when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
        when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
        when(bulkResponse.hasFailures()).thenReturn(true);

        doCallRealMethod().when(spyApiDocumentRepository).deleteApiDocumentByIds(anyList());

        spyApiDocumentRepository.deleteApiDocumentByIds(ids);

    }

    @Test
    public void checkIf_deleteApiDocumentByIds_passed(){

        List<String> ids = new ArrayList<>();
        ids.add("1");
        Client client = mock(Client.class);
        BulkRequestBuilder bulkRequestBuilder = mock(BulkRequestBuilder.class);
        BulkResponse bulkResponse = mock(BulkResponse.class);
        ListenableActionFuture listenableActionFuture = mock(ListenableActionFuture.class);

        when(mockElasticsearchService.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
        when(bulkRequestBuilder.execute()).thenReturn(listenableActionFuture);
        when(listenableActionFuture.actionGet()).thenReturn(bulkResponse);
        when(bulkResponse.hasFailures()).thenReturn(false);

        doCallRealMethod().when(spyApiDocumentRepository).deleteApiDocumentByIds(anyList());

        spyApiDocumentRepository.deleteApiDocumentByIds(ids);

        verify(spyApiDocumentRepository, times(1)).deleteApiDocumentByIds(ids);
    }

}
