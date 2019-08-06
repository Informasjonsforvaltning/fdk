package no.dcat.service;

import no.dcat.authorization.EntityNameService;
import no.dcat.controller.Enhet;
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

    public Enhet getByOrgNr(String orgnr, EntityNameService entityNameService) {
        RestTemplate restTemplate = new RestTemplate();

        Enhet enhet;
        try {
            String uri = openDataEnhetsregisteretProxy + orgnr;
            enhet = restTemplate.getForObject(uri, Enhet.class);
            if (enhet == null) {
                throw new Exception("Enhetsregisteret svarer ikke eller fant ikke organisasjonsnummeret " + uri);
            }
        } catch (Exception e) {
            logger.error("Failed to get org-unit from enhetsregister for organization number {}. Reason {}", orgnr, e.getLocalizedMessage());

            String organizationName = entityNameService.getOrganizationName(orgnr);

            enhet = new Enhet();
            enhet.setNavn(organizationName);
        }

        return enhet;

    }

}
