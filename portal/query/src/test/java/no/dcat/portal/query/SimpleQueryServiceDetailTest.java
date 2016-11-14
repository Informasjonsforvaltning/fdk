package no.dcat.portal.query;

import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.internal.InternalSearchHit;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

/**
 * Class for testing detail resr API in SimpleQueryService.
 */
public class SimpleQueryServiceDetailTest {
    SimpleQueryService sqs;
    Client client;
    SearchResponse response;

    @Before
    public void setUp() {
        sqs = new SimpleQueryService();
        client = mock(Client.class);
        populateMock();
        sqs.client = client;
    }

    /**
     * Tests when dataset is found.
     */
    @Test
    public void testWithHits() {
        ResponseEntity<String> actual = sqs.detail("29");

        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).execute()).actionGet();
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Tests when dataset is not found.
     */
    @Test
    public void testWithNoHits() {
        when(response.getHits().getTotalHits()).thenReturn((long) 0);
        ResponseEntity<String> actual = sqs.detail("29");

        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).execute()).actionGet();
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    private void populateMock() {
        String id = "29";

        SearchHit[] hits = null;
        SearchHit hit = mock(InternalSearchHit.class);

        SearchHits searchHits = mock(SearchHits.class);
        when(searchHits.getHits()).thenReturn(hits);

        response = mock(SearchResponse.class);
        when(response.getHits()).thenReturn(searchHits);
        when(response.getHits().getHits()).thenReturn(new SearchHit[]{hit});
        when(hit.getSourceAsString()).thenReturn("Id");

        when(response.getHits().getTotalHits()).thenReturn((long) 1);

        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setQuery(any(QueryBuilder.class))).thenReturn(builder);
        when(builder.execute()).thenReturn(action);

        when(client.prepareSearch("dcat")).thenReturn(builder);
    }
}
