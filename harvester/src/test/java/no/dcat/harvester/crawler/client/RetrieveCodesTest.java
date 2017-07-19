package no.dcat.harvester.crawler.client;

import no.dcat.data.store.Elasticsearch;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.internal.InternalSearchHit;
import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Class for testing RetrieveCodes.
 */
public class RetrieveCodesTest {
    @Test
    public void test() {
        Elasticsearch elasticsearch = mockElasticsearchQuery(100);

        Map<String, Map<String, SkosCode>> allCodes = RetrieveCodes.getAllCodes();

        for(Types type: Types.values()) {
            assertEquals("", "titel_en", allCodes.get(type.getType()).get("KEY").getPrefLabel().get("en"));
            assertEquals("", "titel_nb", allCodes.get(type.getType()).get("KEY").getPrefLabel().get("nb"));
            assertEquals("", "titel_nn", allCodes.get(type.getType()).get("KEY").getPrefLabel().get("nn"));
        }
    }

    private Elasticsearch mockElasticsearchQuery(int nrOfHits) {
        Elasticsearch elasticsearch = mock(Elasticsearch.class);
        Client client = mock(Client.class);
        when(elasticsearch.getClient()).thenReturn(client);

        SearchResponse response = mockSearchHits(nrOfHits);

        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
        when(action.actionGet()).thenReturn(response);
        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
        when(client.prepareSearch(anyString())).thenReturn(builder);
        when(builder.setTypes(anyString())).thenReturn(builder);
        when(builder.setSize(anyInt())).thenReturn(builder);
        when(builder.execute()).thenReturn(action);
        return elasticsearch;
    }
    private SearchResponse mockSearchHits(int nrOfHits) {
        InternalSearchHit hit = mock(InternalSearchHit.class);

        when(hit.getSourceAsString()).thenReturn("{\n" +
                "  \"uri\": \"KEY\",\n" +
                "  \"authorityCode\": \"K\",\n" +
                "  \"prefLabel\": {\n" +
                "    \"nn\": \"titel_nn\",\n" +
                "    \"nb\": \"titel_nb\",\n" +
                "    \"en\": \"titel_en\"\n" +
                "  }\n" +
                "}");

        SearchHit[] hits;
        hits = new SearchHit[]{hit};

        SearchHits searchHits = mock(SearchHits.class);
        when(searchHits.getTotalHits()).thenReturn(Long.valueOf(nrOfHits));
        when(searchHits.getHits()).thenReturn(hits);

        SearchResponse response = mock(SearchResponse.class);
        when(response.getHits()).thenReturn(searchHits);
        return response;
    }
}
