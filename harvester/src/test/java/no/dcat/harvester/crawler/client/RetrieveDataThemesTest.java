package no.dcat.harvester.crawler.client;

import no.dcat.harvester.crawler.exception.DataThemesNotLoadedException;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.internal.InternalSearchHit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Class for testing RetrieveDataThemes.
 */
@RunWith(MockitoJUnitRunner.class)
public class RetrieveDataThemesTest {

    @Test(expected = DataThemesNotLoadedException.class)
    public void testExceptionWhenNoThemesIsLoaded() {
        int nrOfHits = 0;
        Elasticsearch elasticsearch = mockElasticsearchQuery(nrOfHits);
        RetrieveDataThemes rdt = new RetrieveDataThemes(elasticsearch);

        rdt.getAllDataThemes();
    }

    @Test
    public void testGetAllThemes() {
        int nrOfHits = 1;
        Elasticsearch elasticsearch = mockElasticsearchQuery(nrOfHits);
        RetrieveDataThemes rdt = new RetrieveDataThemes(elasticsearch);

        Map<String, DataTheme> result = rdt.getAllDataThemes();

        DataTheme dt = result.get("http://publications.europa.eu/resource/authority/data-theme/SOCI");

        assertThat(dt.getId()).isEqualTo("http://publications.europa.eu/resource/authority/data-theme/SOCI");
        assertThat(dt.getCode()).isEqualTo("SOCI");
        assertThat(dt.getStartUse()).isEqualTo("2015-10-01");
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
        when(builder.execute()).thenReturn(action);
        return elasticsearch;
    }

    private SearchResponse mockSearchHits(int nrOfHits) {
        InternalSearchHit hit = mock(InternalSearchHit.class);

        when(hit.getSourceAsString()).thenReturn("{\n" +
                "  \"id\": \"http://publications.europa.eu/resource/authority/data-theme/SOCI\",\n" +
                "  \"code\": \"SOCI\",\n" +
                "  \"startUse\": \"2015-10-01\",\n" +
                "  \"title\": {\n" +
                "    \"nb\": \"Befolkning og samfunn\",\n" +
                "    \"en\": \"Population and society\"\n" +
                "  },\n" +
                "  \"conceptSchema\": {\n" +
                "    \"id\": \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
                "    \"title\": \"Dataset types Named Authority List\",\n" +
                "    \"versioninfo\": \"20160921-0\",\n" +
                "    \"versionnumber\": \"20160921-0\"\n" +
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
