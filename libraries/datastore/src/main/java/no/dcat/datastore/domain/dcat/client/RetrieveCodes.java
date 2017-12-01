package no.dcat.datastore.domain.dcat.client;

import no.dcat.shared.SkosCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RetrieveCodes {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveCodes.class);


    public static Map<String, Map<String, SkosCode>> getAllCodes(String hostname) {
        Map<String, Map<String, SkosCode>> allCodes = new HashMap<>();

        RestTemplate restTemplate = new RestTemplate();

        List<String> codeTypes = restTemplate.getForEntity(hostname+"/codes", List.class).getBody();

        for (String codeType : codeTypes) {
            Map<String, SkosCode> codes = new HashMap<>();


            List<SkosCode> body = restTemplate.exchange(hostname+"/codes/" + codeType, HttpMethod.GET, null, new ParameterizedTypeReference<List<SkosCode>>() {}).getBody();


            body.forEach(code -> codes.put(code.getUri(), code));


            allCodes.put(codeType, codes);
        }

        return allCodes;
    }
}
