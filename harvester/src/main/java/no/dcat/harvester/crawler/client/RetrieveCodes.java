package no.dcat.harvester.crawler.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.data.store.Elasticsearch;
import no.dcat.harvester.crawler.Crawler;
import no.dcat.harvester.crawler.exception.CodesNotLoadedException;
import no.dcat.harvester.crawler.exception.DataThemesNotLoadedException;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class for retrieving codes from Elasticsearch.
 */
public class RetrieveCodes {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveCodes.class);


    public RetrieveCodes() {
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
    public static Map<String, Map<String, SkosCode>> getAllCodes() throws DataThemesNotLoadedException {
        Map<String, Map<String, SkosCode>> allCodes = new HashMap<>();

        RestTemplate restTemplate = new RestTemplate();

        List<String> codeTypes = restTemplate.getForEntity("http://themes:8080/codes", List.class).getBody();

        for (String codeType : codeTypes) {
            Map<String, SkosCode> codes = new HashMap<>();


            List<SkosCode> body  = restTemplate.exchange("http://themes:8080/codes/" + codeType, HttpMethod.GET, null, new ParameterizedTypeReference<List<SkosCode>>() {}).getBody();


            body.forEach(code -> codes.put(code.getUri(), code));


            allCodes.put(codeType, codes);
        }


        String s = new Gson().toJson(allCodes);

        logger.info(s);

        return allCodes;
    }
}
