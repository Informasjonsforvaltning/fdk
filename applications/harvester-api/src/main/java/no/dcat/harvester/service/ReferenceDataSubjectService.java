package no.dcat.harvester.service;

import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.client.BasicAuthRestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;

@Service
public class ReferenceDataSubjectService {
    private static Logger logger = LoggerFactory.getLogger(ReferenceDataSubjectService.class);

    @Value("${application.httpUsername}")
    private String httpUsername;

    @Value("${application.httpPassword}")
    private String httpPassword;

    @Value("${application.themesHostname}")
    private String referenceDataUrl;

    @PostConstruct
    public void postConstruct() {
        assert referenceDataUrl != null;
        assert httpUsername != null;
        assert httpPassword != null;

        logger.info("Connect to reference-data service {} with user: {}, password: {}", referenceDataUrl, httpUsername, httpPassword);
    }


    public Subject getSubject(String uri) {
        assert referenceDataUrl != null;

        BasicAuthRestTemplate template = new BasicAuthRestTemplate(httpUsername, httpPassword);

        logger.info("harvest request for subject {}", uri);

        String referenceDataUri = UriComponentsBuilder
                .fromHttpUrl(referenceDataUrl + "/subjects")
                .queryParam("uri", uri)
                .toUriString();

        try {
            Subject forObject = template.getForObject(referenceDataUri, Subject.class);

            return forObject;
        } catch (Exception e) {
            logger.warn("Request for subject with uri {} failed. Reason {}",uri, e.getLocalizedMessage());
        }

        return null;
    }
}

