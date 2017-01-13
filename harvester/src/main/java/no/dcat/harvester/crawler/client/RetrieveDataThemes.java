package no.dcat.harvester.crawler.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.exception.DataThemesNotLoadedException;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;

import java.util.HashMap;
import java.util.Map;

/**
 * Class for retrieving dataThemes from Elasticsearch.
 */
public class RetrieveDataThemes {

    public static final String INDEX_THEME = "theme";
    public static final String TYPE_DATA_THEME = "data-theme";
    public static final int THEME_SEARCH_SIZE = 50;
    private final Client client;

    public RetrieveDataThemes(Elasticsearch elasticsearch) {
        client = elasticsearch.getClient();
    }

    /**
     * Method for retrieving all Skos themes from Elasticsearch.
     * <p/>
     * All Skos themes are retrieved from on Elastic-search, transformed from Json to Java-objects and returned in
     * a map, where the theme-id is the key.
     * <p/>
     * @return All Skos-themes defined in Elasticsearch.
     * @throws DataThemesNotLoadedException Is thrown if no themes were found.
     */
    public Map<String, DataTheme> getAllDataThemes() throws DataThemesNotLoadedException {
        Map<String, DataTheme> dataThemes = new HashMap<>();

        SearchResponse response = client.prepareSearch(INDEX_THEME).setTypes(TYPE_DATA_THEME).setSize(THEME_SEARCH_SIZE).execute().actionGet();
        SearchHits searchHits = response.getHits();

        if (searchHits.getTotalHits() == 0) {
            throw new DataThemesNotLoadedException("Themes has not been loaded.");
        }

        SearchHit[] results = searchHits.getHits();
        for (SearchHit hit : results) {
            String sourceAsString = hit.getSourceAsString();
            if (sourceAsString != null) {
                Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
                DataTheme dataTheme = gson.fromJson(sourceAsString, DataTheme.class);
                dataThemes.put(dataTheme.getId(), dataTheme);
            }
        }

        return dataThemes;
    }
}
