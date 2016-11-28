
package no.dcat.portal.query;

import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Class for testing detail resr API in SimpleQueryService.
 */
@RunWith(MockitoJUnitRunner.class)
public class SimpleQueryServiceThemecountTest {

    SimpleQueryService sqs;
    Client client;

    @Before
    public void setUp() {
        sqs = new SimpleQueryService();
        client = mock(Client.class);
        populateMock();
        sqs.client = client;
    }

    /**
     * Tests that elasicsearch is called with the correct set of Parameters.
     */
    @Test
    public void testElasticSearchIsCalledWithCorrectParametersNoThemeSpecified() {

        ResponseEntity<String> actual =  sqs.themecount("");

        AggregationBuilder builder = AggregationBuilders
                .terms("theme_count")
                .field("theme.code")
                .size(10000)
                .order(Terms.Order.count(false));

        verify(client.prepareSearch("dcat")
                .setQuery(any(QueryBuilder.class))
                .setSize(0)
                .setTypes("dataset")
                .addAggregation(builder).execute()).actionGet();

        assertEquals(HttpStatus.OK.value(), actual.getStatusCodeValue());
    }



    private void populateMock() {
        SearchHit[] hits = null;

        //Tenkte å mocke getTotalHits, men får det ikke til
        //pga at SearchHit[] er  en array.
        //when(hits.getTotalHits()).thenReturn(1) går ikke an...

        SearchHits searchHits = mock(SearchHits.class);
        when(searchHits.getHits()).thenReturn(hits);

        SearchResponse response = mock(SearchResponse.class);
        when(response.getHits()).thenReturn(searchHits);


        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setTypes("dataset")).thenReturn(builder);
        when(builder.setQuery(any(QueryBuilder.class))).thenReturn(builder);
        when(builder.setFrom(anyInt())).thenReturn(builder);
        when(builder.setSize(anyInt())).thenReturn(builder);
        when(builder.addSort(anyString(), any(SortOrder.class))).thenReturn(builder);
        when(builder.addAggregation(any(AbstractAggregationBuilder.class))).thenReturn(builder);
        when(builder.execute()).thenReturn(action);

        when(client.prepareSearch("dcat")).thenReturn(builder);
    }

}