package no.dcat.service;

import no.dcat.model.Enhet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EnhetService {

    private static Logger logger = LoggerFactory.getLogger(EnhetService.class);

    @Value("${application.openDataEnhetProxy}")
    private String openDataEnhetsregisteretProxy;

    public Enhet getByOrgNr(String orgnr) {
        RestTemplate restTemplate = new RestTemplate();
        String url = openDataEnhetsregisteretProxy + orgnr;
        logger.debug("Calling enhetsregiseretproxy: {}", url);
        return restTemplate.getForObject(url, Enhet.class);

    }

}
