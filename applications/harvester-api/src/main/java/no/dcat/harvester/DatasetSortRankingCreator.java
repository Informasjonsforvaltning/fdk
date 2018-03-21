package no.dcat.harvester;

import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.NodeIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by bjg on 19.10.2017.
 */
public class DatasetSortRankingCreator {

    //uri to data catalog registration component
    private static final String REGISTRATION_INTERNAL_URI_DOMAIN = "registrering-fdk";
    private static final String REGISTRATION_EXTERNAL_URI_DOMAIN = "registration-api";

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
            logger.debug("datasets from registration detected: Rank A: ", sourceUri);
            while (datasets.hasNext()) {
                datasets.nextNode().asResource().addProperty(DCATNO.source, "A");
            }
        } else {
            logger.debug("datasets from external source detected: Rank B: ", sourceUri);
            while (datasets.hasNext()) {
                datasets.nextNode().asResource().addProperty(DCATNO.source, "B");
            }
        }
        return model;
    }
}
