package no.dcat.client.referencedata;

import no.dcat.shared.DataTheme;
import no.dcat.shared.LosTheme;
import no.dcat.shared.SkosCode;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public LosTheme getLosCodeByURI(String uri) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<LosTheme> losTheme = restTemplate.getForEntity(referenceDataUrl + "/loscodesbyid?id={uri}",  LosTheme.class, uri);
        return losTheme.getBody();
    }

    public boolean hasLosCodes(List<DataTheme> themes) {
        if (themes == null || themes.isEmpty()) {
            return false;
        }
        List<String> themeStrings = new ArrayList<>();
        for (DataTheme theme : themes) {
            themeStrings.add(theme.getId());
        }
        String listForRest = themeStrings.stream().collect(Collectors.joining(","));
        RestTemplate restTemplate = new RestTemplate();
        Boolean hasLosCodes = restTemplate.exchange(referenceDataUrl + "/loscodes/hasLosTheme?themes={listForRest}", HttpMethod.GET, null, Boolean.class,listForRest).getBody();
        return hasLosCodes;
    }

    public List<String> expandLOSTema(List<DataTheme> themes) {
        if (themes == null || themes.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> themeStrings = new ArrayList<>();
        for (DataTheme theme : themes) {
            themeStrings.add(theme.getId());
        }

        String listForRest = themeStrings.stream().collect(Collectors.joining(","));
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<List<String>> expandeds = restTemplate.exchange(referenceDataUrl + "/loscodes/expandLosTheme?themes={listForRest}", HttpMethod.GET, null, new ParameterizedTypeReference<List<String>>() {}, listForRest);
        return expandeds.getBody().stream().map(String::toLowerCase).collect(Collectors.toList());
    }

    public List<String> expandLOSTemaByLOSPath(String path) {
        if (path == null || path.isEmpty()) {
            return new ArrayList<>();
        }
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<List<String>> expandeds = restTemplate.exchange(referenceDataUrl + "/loscodes/expandLosThemeByPaths?themes={listForRest}", HttpMethod.GET, null, new ParameterizedTypeReference<List<String>>() {}, path);
        return expandeds.getBody().stream().map(String::toLowerCase).collect(Collectors.toList());
    }
}

