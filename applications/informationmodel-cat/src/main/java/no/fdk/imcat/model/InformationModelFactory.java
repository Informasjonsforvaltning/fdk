package no.fdk.imcat.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class InformationModelFactory {
    private static final Logger logger = LoggerFactory.getLogger(InformationModelFactory.class);

    @Autowired
    public InformationModelFactory() {

    }
    public InformationModel createInformationModel(InformationModelHarvestSource source) {
        InformationModel model = new InformationModel();
        model.setHarvestSourceUri(source.URI);
        model.setId(source.id);
        model.setTitle(source.title);
        model.setSchema(source.schema);

        return model;
    }

}
