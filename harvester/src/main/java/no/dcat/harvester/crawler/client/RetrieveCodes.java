package no.dcat.harvester.crawler.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.data.store.Elasticsearch;
import no.dcat.data.store.domain.dcat.SkosCode;
import no.dcat.harvester.crawler.Types;
import no.dcat.harvester.crawler.exception.CodesNotLoadedException;
import no.dcat.harvester.crawler.exception.DataThemesNotLoadedException;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;

import java.util.HashMap;
import java.util.Map;

/**
 * Class for retrieving codes from Elasticsearch.
 */
public class RetrieveCodes {
    public static final String INDEX_CODES = "codes";
    public static final int THEME_SEARCH_SIZE = 50;
    private final Client client;

    public RetrieveCodes(Elasticsearch elasticsearch) {
        client = elasticsearch.getClient();
    }

    /**
     * Method for retrieving all codes from Elasticsearch.
     * <p/>
     * All codes are retrieved from on Elasticsearch, transformed from Json to Java-objects and returned in
     * a map, where the code is the key.
     * <p/>
     * @return All codes defined in Elasticsearch.
     * @throws DataThemesNotLoadedException Is thrown if no codes in one type were not found.
     */
    public Map<String, Map<String, SkosCode>> getAllCodes() throws DataThemesNotLoadedException {
        Map<String, Map<String, SkosCode>> allCodes = new HashMap<>();

        for(Types type: Types.values()) {
            Map<String, SkosCode> codes = new HashMap<String, SkosCode>();

            SearchResponse response = client.prepareSearch(INDEX_CODES).setTypes(type.getType()).setSize(THEME_SEARCH_SIZE).execute().actionGet();
            SearchHits searchHits = response.getHits();

            if (searchHits.getTotalHits() == 0) {
                throw new CodesNotLoadedException(String.format("Code %s has not been loaded.", type));
            }

            SearchHit[] results = searchHits.getHits();
            for (SearchHit hit : results) {
                String sourceAsString = hit.getSourceAsString();
                if (sourceAsString != null) {
                    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
                    SkosCode code = gson.fromJson(sourceAsString, SkosCode.class);
                    codes.put(code.getUri(), code);
                }
            }
            allCodes.put(type.getType(), codes);
        }
        return allCodes;
    }
}
