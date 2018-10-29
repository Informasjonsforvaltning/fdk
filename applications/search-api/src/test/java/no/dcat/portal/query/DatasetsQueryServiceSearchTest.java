
package no.dcat.portal.query;

import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.aggregations.AbstractAggregationBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Class for testing getDatasetByIdHandler Rest-API in DatasetsQueryService.
 */
@RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class DatasetsQueryServiceSearchTest {

    DatasetsQueryService sqs;
    Client client;

    @Before
    public void setUp() {
        sqs = new DatasetsQueryService();
        client = mock(Client.class);
        populateMock();
        sqs.setClient(client);
    }

    /**
     * Valid call, with sortdirection set.
     */
    @Test
    public void testValidWithSortdirection() {
        ResponseEntity<String> actual = sqs.search("query","", "", "", "","",0, 0,0, 1, 10, "nb", "title.nb", "ascending", "", "", "", "", "");

        verify(client.prepareSearch("dcat")
                .setTypes("dataset")
                .setQuery(any(QueryBuilder.class))
                .setFrom(1).setSize(10))
                .addSort(SortBuilders.fieldSort("title.nb.raw").order(SortOrder.ASC).missing("_last"));
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());

        sqs.search("query", "","", "", "","",0, 0,0, 1, 10, "nb", "title.nb", "ascending", "", "", "", "", "");
    }

    /**
     * Valid call, check default sort direction.
     */
    @Test
    public void testValidWithDefaultSortdirection() {
        ResponseEntity<String> actual = sqs.search("query","","",  "", "", "",0,0,0, 1,  10, "nb", "", "", "", "", "", "", "");

        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(1)).setSize(10);
        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(1).setSize(10), never()).addSort("", SortOrder.ASC);
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Valid call, with tema set.
     */
    @Test
    public void testValidWithTema() {
        ResponseEntity<String> actual = sqs.search("query","", "GOVE", "", "", "", 0,0,0, 1, 10, "nb", "", "", "", "", "", "", "");

        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(1)).setSize(10);
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());

        sqs.search("", "","Ukjent","", "", "", 0,0,0, 1, 10, "nb", "", "", "", "", "", "", "");
    }

    /**
     * Valid call, with publisher TODO - does this test anything?
     */
    @Test
    public void testValidWithPublisher() {
        ResponseEntity<String> actual = sqs.search("query", "","", "REGISTERENHETEN I BRØNNØYSUND", "", "",0,0,0,1, 10, "nb", "", "", "", "", "", "", "");

        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(1)).setSize(10);
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Inputparameter validation. Minus from value shall throw http-error bad request.
     */
    @Test
    public void return200IfFromIsBelowZero() {
        ResponseEntity<String> actual = sqs.search("", "","", "", "", "",0,0,0, -10, 1000, "nb", "", "", "", "", "", "", "");

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    /**
     * Inputparameter validation. Over 100 size shall throw http-error bad request.
     */
    @Test
    public void return200IfSizeIsLargerThan100() {
        ResponseEntity<String> actual = sqs.search("", "","", "", "","",0,0, 0,10, 101, "nb", "", "", "", "", "", "", "");

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    public void checkSortfields() {
        sqs.search("","","","","","", 0,0, 0 , 0, 20,"en", "modified","", "", "", "", "", "");
        sqs.search("","","","","","", 0,0, 0 , 0, 20,"", "noe annet","asc", "", "", "", "", "");
        sqs.search("","","","","","", 0,0, 0 , 0, 20,"", "noe annet","desc", "", "", "", "", "");

    }

    @Test
    public void checkAndAdjustSizeLessThanZero() {
        sqs.search("","","","","","", 0, 0,0 , 0, -200,"", "","", "", "", "", "", "");
    }

    @Test
    public void checkAccessRights() {
        sqs.search("","","","","Ukjent","", 0, 0,0 , 0, 20,"", "","", "", "", "", "", "");
        sqs.search("","","","","OPEN","", 0, 0,0 , 0, 20,"", "","", "", "", "", "", "");
    }

    @Test
    public void checkHarvestMetadata() {
        sqs.search("","","","","","", 3, 0 , 0,0, 20,"", "","", "", "", "", "", "");
        sqs.search("","","","","","", 0, 3 ,0, 0, 20,"", "","", "", "", "", "", "");
        sqs.search("","","","","","", 0, 0 ,3, 0, 20,"", "","", "", "", "", "", "");
    }

    @Test
    public void checkPublisherValue() {
        sqs.search("", "","", "Torsken", "", "", 0, 0, 0,0, 20, "", "", "", "", "", "", "", "");
        sqs.search("", "","", "Ukjent", "", "", 0, 0, 0,0, 20, "", "", "", "", "", "", "", "");
    }

    @Test
    public void checkOrgpath() {
        sqs.search("","","","","","/ANNET", 0,0, 0 , 0, 20,"", "","", "", "", "", "", "");
    }


    @Test
    public void checkTitle() {
        sqs.search("","TITLE","","","","/ANNET", 0,0, 0 , 0, 20,"", "","", "", "", "", "", "");
    }

    @Test
    public void testTitle() {
        ResponseEntity<String> actual = sqs.search("", "TITLE","", "", "", "/ANNET",0,0,0,1, 10, "nb", "", "", "", "", "", "", "");

        verify(client.prepareSearch("dcat").setTypes("dataset").setQuery(any(QueryBuilder.class)).setFrom(1)).setSize(10);
        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
    }



    @Test
    public void checkSubject() {

        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "http://chebang.no", "", "", "", "");
        sqs.search("","","","","","", 0, 0, 0,0, 20,"", "","", "http://chebang.no,https://kokko.no", "", "", "", "");
        sqs.search("","","","","","", 0, 0, 0,0, 20,"", "","", "Barebare", "", "", "", "");
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "Barebare,Endabare", "", "", "", "");
    }

    @Test
    public void checkSpatial() {

        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "Ukjent", "", "");
        sqs.search("","","","","","", 0, 0, 0,0, 20,"", "","", "", "", "Norge", "", "");
        sqs.search("","","","","","", 0, 0, 0,0, 20,"", "","", "", "", "Oslo", "", "");
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "barbara", "", "");
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "http://tulletse", "", "");
    }
    @Test
    public void checkDistributionLicence(){
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "", "true", "");
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "", "false", "");

    }

    @Test
    public void checkMultipleSpatialLabels() {
        sqs.search("","","","","","", 0, 0, 0, 0, 20,"", "","", "", "", "Ukjent,Oslo Fylke", "", "");
    }

    @Test
    public void checkProvenance() {

        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "NASJONAL", "", "", "");
        sqs.search("","","","","","", 0, 0 , 0,0, 20,"", "","", "", "", "", "", "");
        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "VEDTAK", "", "", "");
    }

    @Test
    public void checkOpendata(){
        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "", "", "true", "");
        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "", "", "false", "");
    }

    @Test
    public void checkCatalog(){
        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "", "", "", "http://catalog.url");
        sqs.search("","","","","","", 0, 0 ,0, 0, 20,"", "","", "", "", "", "", "Katalog for Brønnøysundregistrene");
    }

    @Test
    public void aggregateDatasets() {
        ResponseEntity<String> actual = sqs.aggregateDatasets("query");

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());

        actual = sqs.aggregateDatasets("");

        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());

    }

    private void populateMock() {
        SearchResponse response = mock(SearchResponse.class);

        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);

        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(builder.setTypes("dataset")).thenReturn(builder);
        when(builder.setQuery((QueryBuilder)any())).thenReturn(builder);
        when(builder.setFrom(anyInt())).thenReturn(builder);
        when(builder.setSize(anyInt())).thenReturn(builder);
        when(builder.addSort(any())).thenReturn(builder);
        when(builder.addAggregation(any(AbstractAggregationBuilder.class))).thenReturn(builder);
        when(builder.execute()).thenReturn(action);

        when(client.prepareSearch("dcat")).thenReturn(builder);
    }

}
