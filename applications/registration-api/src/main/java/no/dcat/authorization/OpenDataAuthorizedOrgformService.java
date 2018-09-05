package no.dcat.authorization;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Profile("prod")
@Service
public class OpenDataAuthorizedOrgformService implements AuthorizedOrgformService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private RestTemplate restTemplate = new RestTemplate();

    @Value("${application.authentication.includedOrgforms}")
    private String[] authorizedCodes;

    @Value("${application.authentication.includedOrgnr}")
    private String[] authorizedOrgnr;

    @Value("${application.openDataEnhet}")
    private String openDataEnhetsregisteret;

    @Override
    public boolean isIncluded(Entity entry) {
        ResponseEntity<OpenDataEnhet> response;
        try {
            response = restTemplate.getForEntity(openDataEnhetsregisteret + entry.getOrganizationNumber(), OpenDataEnhet.class);
            return response.getStatusCode().is2xxSuccessful() && isAuthorisedOrganisation(response.getBody());
        } catch (RuntimeException rte) {
            logger.warn("Error in getting entity from {} on {}", openDataEnhetsregisteret, entry.getOrganizationNumber());
            logger.warn("Actual error", rte);

            //if enhetsregisteret webservice is unavailable, do not include organisation
            //todo: should be handled better
            logger.info("excluding entity {} due to missing response from Enhetsregisteret web service", entry.getOrganizationNumber());
            return false;
        }
    }

    private boolean isAuthorisedOrganisation(OpenDataEnhet enhet) {
        return isAuthorisedOrgform(enhet.getOrgform().kode) || isAuthorisedOrganisation(enhet.organisasjonsnummer);
    }

    private boolean isAuthorisedOrgform(String kode) {
        return Arrays.asList(authorizedCodes).contains(kode);
    }

    private boolean isAuthorisedOrganisation(String orgnr) {
        return Arrays.asList(authorizedOrgnr).contains(orgnr);
    }

    void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    void setAuthorizedCodes(String[] authorizedCodes) {
        this.authorizedCodes = authorizedCodes;
    }

    void setAuthorizedOrgnr(String[] authorizedOrgnr) {
        this.authorizedOrgnr = authorizedOrgnr;
    }

    void setOpenDataEnhetsregisteret(String openDataEnhetsregisteret) {
        this.openDataEnhetsregisteret = openDataEnhetsregisteret;
    }
}
