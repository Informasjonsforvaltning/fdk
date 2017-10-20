package no.dcat.harvester;

import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.NodeIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;

/**
 * Created by bjg on 19.10.2017.
 */
public class DatasetSortRankingCreator {

    //uri to data catalog registration component
    private static final String REGISTRATION_INTERNAL_URI_DOMAIN = "registrering-fdk";
    private static final String REGISTRATION_EXTERNAL_URI_DOMAIN = "registration-api";
    private static final int RANDOM_STRING_LENGTH = 20;

    private final Logger logger = LoggerFactory.getLogger(DatasetSortRankingCreator.class);

    /**
     * Populates a search ranking field for each dataset in model
     * The search ranking is dependent on the source:
     * Datasets from registration component is ranked higher than
     * datasets from other sources
     *
     * @param model
     * @return model with populated search ranking field for each dataset
     */
    public Model rankDatasets(Model model, String sourceUri) {
        NodeIterator datasets = model.listObjectsOfProperty(DCAT.dataset);
        if(sourceUri.contains(REGISTRATION_INTERNAL_URI_DOMAIN) || sourceUri.contains(REGISTRATION_EXTERNAL_URI_DOMAIN)) {
            logger.debug("datasets from registration detected:");
            while (datasets.hasNext()) {
                String rankString = "A-" + generateRandomString(RANDOM_STRING_LENGTH);
                datasets.nextNode().asResource().addProperty(DCATNO.source, rankString);
                logger.debug("   {}", rankString);
            }
        } else {
            logger.debug("datasets from external source detected:");
            while (datasets.hasNext()) {
                String rankString = "B-" + generateRandomString(RANDOM_STRING_LENGTH);
                datasets.nextNode().asResource().addProperty(DCATNO.source, rankString);
                logger.debug("   {}", rankString);
            }
        }
        return model;
    }


    private String generateRandomString(int length) {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}
