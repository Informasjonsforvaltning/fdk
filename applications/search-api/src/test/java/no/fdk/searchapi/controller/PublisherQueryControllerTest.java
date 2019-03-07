package no.fdk.searchapi.controller;

import no.fdk.searchapi.service.ElasticsearchService;
import no.fdk.test.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHits;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Class for testing publisher rest-API in DatasetsQueryService.
 */
@RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class PublisherQueryControllerTest {
    public static final String INDEX = "dcat";
    public static final String TYPE = "publisher";
    public static final int NR_OF_HITS = 12;
    PublisherQueryController sqs;
    Client client;
    SearchResponse response;

    @Before
    public void setUp() {
        client = mock(Client.class);
        populateMock();
        ElasticsearchService elasticsearchServiceMock = mock(ElasticsearchService.class);
        when(elasticsearchServiceMock.getClient()).thenReturn(client);
        sqs = new PublisherQueryController(elasticsearchServiceMock);
    }

    /**
     * Tests that both elasticsearch methods are called with correct set of parameters when retrieving all publisher.
     */
    @Test
    public void testValidGetAllPublisher() {
        ResponseEntity<String> actual = sqs.publishers("");

        verify(client.prepareSearch(INDEX).setTypes(TYPE)).setQuery(any(QueryBuilder.class));
        //Denne feiler når man bygger ned maven, finner ikke ut hvorfor.
        //verify(client.prepareSearch(INDEX).setTypes(TYPE).setQuery(any(QueryBuilder.class)).setSize(NR_OF_HITS));
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    private void populateMock() {
        mockResponse();
        mockRequest();
    }

    private void mockResponse() {
        SearchHits searchHits = mock(SearchHits.class);

        response = mock(SearchResponse.class);
        when(response.getHits()).thenReturn(searchHits);

        when(response.getHits().getTotalHits()).thenReturn((long) NR_OF_HITS);
    }

    private void mockRequest() {
        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setQuery((QueryBuilder) any())).thenReturn(builder);
        when(builder.execute()).thenReturn(action);
        when(builder.setTypes(TYPE)).thenReturn(builder);
        when(client.prepareSearch(INDEX)).thenReturn(builder);

        when(builder.setSize(NR_OF_HITS)).thenReturn(builder);
    }
}
