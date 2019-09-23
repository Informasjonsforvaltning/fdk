package no.fdk.searchapi.controller.datasetssearch;

import com.google.common.collect.ImmutableMap;
import no.fdk.searchapi.service.ElasticsearchService;
import no.fdk.test.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * Class for testing getDatasetByIdHandler Rest-API in DatasetsQueryService.
 */
@RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class DatasetsSearchControllerTest {

    DatasetsSearchController sqs;
    Client client;

    @Before
    public void setUp() {
        client = mock(Client.class);
        populateMock();
        ElasticsearchService elasticsearchServiceMock = mock(ElasticsearchService.class);
        when(elasticsearchServiceMock.getClient()).thenReturn(client);
        sqs = new DatasetsSearchController(elasticsearchServiceMock);
    }

    /**
     * Valid call, with sortdirection set.
     */
    @Test
    public void testValidWithSortdirection() {
        ResponseEntity<String> actual = sqs.search(ImmutableMap.of(), "nb", "modified", "asc", "", PageRequest.of(0, 10));

        verify(client.prepareSearch("dcat")
            .setTypes("dataset")
            .setQuery(any(QueryBuilder.class))
            .setFrom(0).setSize(10))
            .addSort(SortBuilders.fieldSort("harvest.firstHarvested").order(SortOrder.ASC).missing("_last"));

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Valid call, check default sort.
     */
    @Test
    public void testValidWithDefaultSortdirection() {
        ResponseEntity<String> actual = sqs.search(ImmutableMap.of(), "nb", "", "", "", PageRequest.of(0, 10));

        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(0).setSize(10), never()).addSort(any());
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Valid call, with theme set.
     */
    @Test
    public void testValidWithTheme() {
        ResponseEntity<String> actual = sqs.search(ImmutableMap.of("theme", "GOVE"), "nb", "", "",  "", PageRequest.of(0, 10));

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Inputparameter validation. Over 100 size shall throw http-error bad request.
     */
    @Test
    public void return200IfSizeIsLargerThan100() {
        ResponseEntity<String> actual = sqs.search(ImmutableMap.of(), "nb", "", "", "",  PageRequest.of(0, 101));

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }


    @Test
    public void checkAccessRights() {
        sqs.search(ImmutableMap.of("accessRights", "OPEN"), "nb", "", "", "",  PageRequest.of(0, 10));
    }

    @Test
    public void checkOrgpath() {
        sqs.search(ImmutableMap.of("orgPath", "/ANNET"), "nb", "", "", "",  PageRequest.of(0, 10));
    }


    @Test
    public void checkTitle() {
        sqs.search(ImmutableMap.of("title", "TITLE"), "nb", "", "", "",  PageRequest.of(0, 10));
    }

    @Test
    public void checkProvenance() {
        sqs.search(ImmutableMap.of("provenance", "NASJONAL"), "nb", "", "", "",  PageRequest.of(0, 10));
    }

    @Test
    public void checkSpatial() {
        sqs.search(ImmutableMap.of("spatial", "Oslo"), "nb", "", "", "",  PageRequest.of(0, 10));
        sqs.search(ImmutableMap.of("spatial", "http://tulletse"), "nb", "", "", "",  PageRequest.of(0, 10));
        sqs.search(ImmutableMap.of("spatial", "Ukjent"), "nb", "", "", "",  PageRequest.of(0, 10));
        sqs.search(ImmutableMap.of("spatial", "Ukjent,Oslo Fylke"), "nb", "", "", "",  PageRequest.of(0, 10));
    }

    @Test
    public void checkDatasetAggregations() {
        sqs.search(ImmutableMap.of(), "nb", "modified", "asc", "distributionCountForTypeApi,distributionCountForTypeFeed,distributionCountForTypeFile", PageRequest.of(0, 10));
    }

    private void populateMock() {
        SearchResponse response = mock(SearchResponse.class);

        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setTypes("dataset")).thenReturn(builder);
        when(builder.setQuery((QueryBuilder) any())).thenReturn(builder);
        when(builder.setFrom(anyInt())).thenReturn(builder);
        when(builder.setSize(anyInt())).thenReturn(builder);
        when(builder.addSort(any())).thenReturn(builder);
        when(builder.execute()).thenReturn(action);

        when(client.prepareSearch("dcat")).thenReturn(builder);
    }

}
