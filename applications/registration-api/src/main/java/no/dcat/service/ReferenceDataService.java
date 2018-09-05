package no.dcat.service;

import no.dcat.shared.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;

@Service
public class ReferenceDataService {

    private static Logger logger = LoggerFactory.getLogger(ReferenceDataService.class);


    @Value("${application.httpUsername}")
    private String httpUsername;

    @Value("${application.httpPassword}")
    private String httpPassword;

    @Value("${application.themesServiceUrl}")
    private String referenceDataUrl;


    @PostConstruct
    public void postConstruct() {
        logger.info("Connect to reference-data subject service with user: {}, password: {}", httpUsername, httpPassword);
    }


    public Subject getSubject(String uri) {
        BasicAuthRestTemplate template = new BasicAuthRestTemplate(httpUsername, httpPassword);

        String referenceDataUri = UriComponentsBuilder
                .fromHttpUrl(referenceDataUrl + "/subjects")
                .queryParam("uri", uri)
                .toUriString();

        Subject forObject = template.getForObject(referenceDataUri, Subject.class);
        logger.debug(forObject.toString());
        return forObject;
    }
}
