package no.dcat.client.referencedata;

import no.dcat.shared.SkosCode;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReferenceDataClient {
    private String referenceDataUrl;
    private Map<String, Map<String, SkosCode>> allCodesCacheByCode;

    public ReferenceDataClient(String referenceDataUrl) {
        this.referenceDataUrl = referenceDataUrl;
    }

    public Map<String, Map<String, SkosCode>> getAllCodes() {
        return allCodesCacheByCode != null ? allCodesCacheByCode : (allCodesCacheByCode = getAllCodesByCode(referenceDataUrl));
    }

    public Map<String, SkosCode> getCodes(String typeCode) {
        return getAllCodes().get(typeCode);
    }

    public static Map<String, List<SkosCode>> fetchAllCodes(String hostname) {
        Map<String, List<SkosCode>> allCodesAsLists = new HashMap<>();

        RestTemplate restTemplate = new RestTemplate();

        List<String> codeTypes = restTemplate.getForEntity(hostname + "/codes", List.class).getBody();

        for (String codeType : codeTypes) {
            List<SkosCode> body = restTemplate.exchange(hostname + "/codes/" + codeType, HttpMethod.GET, null, new ParameterizedTypeReference<List<SkosCode>>() {
            }).getBody();

            allCodesAsLists.put(codeType, body);
        }

        return allCodesAsLists;
    }

    public static Map<String, Map<String, SkosCode>> getAllCodesByUri(String hostname) {
        return mapAllCodesByUri(fetchAllCodes(hostname));
    }

    public static Map<String, Map<String, SkosCode>> getAllCodesByCode(String hostname) {
        return mapAllCodesByCode(fetchAllCodes(hostname));
    }

    private static Map<String, Map<String, SkosCode>> mapAllCodesByUri(Map<String, List<SkosCode>> allCodesAsLists) {
        Map<String, Map<String, SkosCode>> allCodes = new HashMap<>();

        for (String codeType : allCodesAsLists.keySet()) {
            Map<String, SkosCode> codes = new HashMap<>();
            allCodesAsLists.get(codeType).forEach(code -> codes.put(code.getUri(), code));
            allCodes.put(codeType, codes);
        }

        return allCodes;
    }

    private static Map<String, Map<String, SkosCode>> mapAllCodesByCode(Map<String, List<SkosCode>> allCodesAsLists) {
        Map<String, Map<String, SkosCode>> allCodes = new HashMap<>();

        for (String codeType : allCodesAsLists.keySet()) {
            Map<String, SkosCode> codes = new HashMap<>();
            allCodesAsLists.get(codeType).forEach(code -> codes.put(code.getCode(), code));
            allCodes.put(codeType, codes);
        }

        return allCodes;
    }

}

