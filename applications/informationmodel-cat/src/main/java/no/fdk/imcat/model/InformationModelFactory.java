package no.fdk.imcat.model;

import no.dcat.shared.Publisher;
import no.fdk.imcat.service.PublisherCatClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class InformationModelFactory {
    private static final Logger logger = LoggerFactory.getLogger(InformationModelFactory.class);
    private PublisherCatClient publisherCatClient;

    @Autowired
    public InformationModelFactory(PublisherCatClient publisherCatClient) {
        this.publisherCatClient = publisherCatClient;
    }

    public InformationModel createInformationModel(InformationModelHarvestSource source) {
        InformationModel model = new InformationModel();
        model.setHarvestSourceUri(source.URI);
        model.setId(source.id);
        model.setTitle(source.title);
        model.setSchema(source.schema);
        model.setPublisher(lookupPublisher(source.publisherOrgNr));

        return model;
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
