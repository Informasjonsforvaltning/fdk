package no.dcat.factory;

import no.dcat.model.Contact;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RegistrationFactory {
    private static String catalogUriPrefix;

    public static RegistrationFactory INSTANCE = new RegistrationFactory();

    private final DatasetIdGenerator datasetIdGenerator = new DatasetIdGenerator();

    @Value("${spring.application.catalogUriPrefix}")
    public void setCatalogUriPrefix(String uri) {
        catalogUriPrefix = uri;
    }

    public Dataset createDataset(String catalogId) {
        Dataset dataset = new Dataset();

        dataset.setId(datasetIdGenerator.createId());
        dataset.setUri(getCatalogUri(catalogId) + "/datasets/" + dataset.getId());
        dataset.setCatalog(catalogId);

        return dataset;
    }

    public Contact createContact(String catalogId) {
        Contact contact = new Contact();
        contact.setId(datasetIdGenerator.createId());
        contact.setUri(getCatalogUri(catalogId) + "/contacts/" + contact.getUri());

        return contact;
    }

    public Distribution createDistribution(String catalogId, String datasetId) {
        Distribution distribution = new Distribution();
        distribution.setId(datasetIdGenerator.createId());
        distribution.setUri(getDatasetUri(catalogId,datasetId) + "/distributions/" + distribution.getId());

        return distribution;
    }

    public String getCatalogUri(String catalogId) {
        return catalogUriPrefix + "/catalogs/" + catalogId;
    }

    public  String getDatasetUri(String catalogId, String datasetId) {
        return getCatalogUri(catalogId) + "/datasets/" + datasetId;
    }

    public String getContactUri(String catalogId, String contactId) {
        return getCatalogUri(catalogId) + "/contacts/" + contactId;
    }

    public String getDistributionUri(Distribution distribution, Dataset parentDataset) {
        return parentDataset.getUri() + "/distributions/" + distribution.getId();
    }


}
