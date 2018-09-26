package no.dcat.portal.query;

import no.dcat.shared.testcategories.UnitTest;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URLDecoder;
import java.net.URLEncoder;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.Assert.*;

/**
 * Created by nodavsko on 12.10.2017.
 */
@Category(UnitTest.class)
public class UrlEncodedIdWorksTest {
    Logger logger = LoggerFactory.getLogger(UrlEncodedIdWorksTest.class);
    DatasetsQueryService sqs;
    Client client;
    SearchResponse response;

    @Before
    public void setUp() throws Throwable {
        sqs = new DatasetsQueryService();
        client = mock(Client.class);
        populateMock();
        sqs.setClient(client);
    }

    @Test
    public void getDataset() throws Throwable {
        String id = URLEncoder.encode("http://nok/en/urlø/meæd/laång/path", "utf-8");

        ResponseEntity<String> actual = sqs.detail(new ServletRequest(id));

        assertThat(actual.getStatusCode(), is(HttpStatus.OK));
    }

    @Test
    public void uriEncodedOK() throws Throwable {
        String id = "http://data.brreg.no/datakatalog/datasets/974761076/76";
        String urlencoded = URLEncoder.encode(id, "utf-8");
        String id2 = "http%3A%2F%2Fdata.brreg.no%2Fdatakatalog%2Fdatasets%2F974761076%2F76";
        ServletRequest request = new ServletRequest(urlencoded);

        String actual = sqs.extractIdentifier(request);

        assertThat(urlencoded, is(id2));

        assertThat(actual, is(urlencoded));
    }

    @Test
    public void uriEncodedHttpsOK() throws Throwable {
        String id = "https://data.brreg.no/http//datakatalog/datasets/974761076/76";

        String urlencoded = URLEncoder.encode(id, "utf-8");
        ServletRequest request = new ServletRequest(urlencoded);

        String actual = sqs.extractIdentifier(request);

        logger.info("uri: {}", URLDecoder.decode(actual, "utf-8"));
        assertThat(actual, is(urlencoded));
    }


    private void populateMock() throws Throwable {
        String id = URLEncoder.encode("http://brreg.no/this/is/the/dataset/23", "utf-8");

        SearchHit[] hits = null;
        SearchHit hit = mock(SearchHit.class);

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
