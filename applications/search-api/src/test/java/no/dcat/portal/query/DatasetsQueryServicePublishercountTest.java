
package no.dcat.portal.query;

import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.mockito.internal.matchers.Equals;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Class for testing detail resr API in DatasetsQueryService.
 */
@RunWith(MockitoJUnitRunner.class)
public class DatasetsQueryServicePublishercountTest {

    DatasetsQueryService sqs;
    Client client;

    @Before
    public void setUp() {
        sqs = new DatasetsQueryService();
        client = mock(Client.class);
        populateMock();
        sqs.client = client;
    }

    /**
     * Tests:
     * All publisher should be aggregated when no publisher is defined..
     */
    @Test
    public void testNoPublisherDefined() {

        ResponseEntity<String> actual =  sqs.publisherCount("");

        TermsBuilder builder = AggregationBuilders
                .terms("publisherCount")
                .field("publisher.name.raw")
                .size(1000)
                .order(Terms.Order.count(false));

        //Input variable can'r be testet because thers no get method for the fields set.
        //ArgumentCaptor<TermsBuilder> argumentCaptor = ArgumentCaptor.forClass(TermsBuilder.class);

        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class))).setSize(0);
        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).setSize(0)).setTypes("dataset");
        //verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).setSize(0).setTypes("dataset"))
        //        .addAggregation(argumentCaptor.capture());
        //TermsBuilder builderRes = argumentCaptor.getValue();

        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).setSize(0).setTypes("dataset")
                .addAggregation(builder).execute()).actionGet();

        assertEquals(HttpStatus.OK.value(), actual.getStatusCodeValue());
    }

    /**
     * Tests:
     * All publisher should be aggregated when no publisher is defined..
     */
    @Test
    public void testOnePublisherIdDefined() {
        String filedValue = "ARBEIDSTILSYNET";

        ResponseEntity<String> actual =  sqs.publisherCount(filedValue);

        AggregationBuilder builder = AggregationBuilders
                .terms("publisherCount")
                .field("publisher.name.raw")
                .size(10000)
                .order(Terms.Order.count(false));

        verify(client.prepareSearch("dcat")).setQuery(any(QueryBuilder.class));
        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class))).setSize(0);
        verify(client.prepareSearch("dcat").setQuery(any(QueryBuilder.class)).setSize(0).setTypes("dataset")
                .addAggregation(builder).execute()).actionGet();

        assertEquals(HttpStatus.OK.value(), actual.getStatusCodeValue());
    }



    private void populateMock() {
        SearchHit[] hits = null;

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