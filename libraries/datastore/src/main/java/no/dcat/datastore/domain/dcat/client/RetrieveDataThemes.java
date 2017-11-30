package no.dcat.datastore.domain.dcat.client;

import no.dcat.shared.DataTheme;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class RetrieveDataThemes {

    public static Map<String, DataTheme> getAllDataThemes(String hostname) {
        Map<String, DataTheme> dataThemes = new HashMap<>();


        RestTemplate restTemplate = new RestTemplate();

        List<DataTheme> body = restTemplate.exchange(hostname+"/themes/", HttpMethod.GET, null, new ParameterizedTypeReference<List<DataTheme>>() {
        }).getBody();

        body.forEach(theme -> dataThemes.put(theme.getId(), theme));


        return dataThemes;
    }
}
