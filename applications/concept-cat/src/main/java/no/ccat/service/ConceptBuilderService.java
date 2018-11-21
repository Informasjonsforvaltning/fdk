package no.ccat.service;

import no.dcat.shared.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConceptBuilderService {
    static private final Logger logger = LoggerFactory.getLogger(ConceptBuilderService.class);

    private PublisherCatClient publisherCatClient;

    @Autowired
    public ConceptBuilderService(PublisherCatClient publisherCatClient) {
        this.publisherCatClient = publisherCatClient;
    }

    Publisher lookupPublisher(String orgNr) {
        try {
            return publisherCatClient.getByOrgNr(orgNr);
        } catch (Exception e) {
            logger.warn("Publisher lookup failed for orgNr={}. Error: {}", orgNr, e.getMessage());
        }
        return null;
    }
}
