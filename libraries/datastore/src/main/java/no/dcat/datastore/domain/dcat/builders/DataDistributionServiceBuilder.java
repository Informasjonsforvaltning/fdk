package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.vocabulary.DCATapi;
import no.dcat.shared.DataDistributionService;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by bjg on 05.03.2019.
 */
public class DataDistributionServiceBuilder extends AbstractBuilder {
    private static Logger logger = LoggerFactory.getLogger(DataDistributionServiceBuilder.class);

    public static DataDistributionService create(Resource dataDistServiceResource) {
        DataDistributionService dataDistService = new DataDistributionService();
        if(dataDistServiceResource != null) {
            logger.debug("Creating DatasetDistributionService from resource: {}", dataDistServiceResource.toString());

            dataDistService.setId(null);
            dataDistService.setUri(dataDistServiceResource.getURI());

            dataDistService.setTitle(extractLanguageLiteral(dataDistServiceResource, DCTerms.title));
            dataDistService.setDescription(extractLanguageLiteral(dataDistServiceResource, DCTerms.description));
            dataDistService.setPublisher(extractPublisher(dataDistServiceResource, DCTerms.publisher));
            dataDistService.setEndpointDescription(extractSkosConcept(dataDistServiceResource, DCATapi.endpointDescription));
        }
        return dataDistService;
    }
}
