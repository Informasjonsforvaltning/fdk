package no.dcat.factory;

import no.dcat.model.ApiSpecification;
import no.dcat.model.Dataset;
import no.dcat.shared.Contact;
import no.dcat.shared.Distribution;

import java.util.UUID;

public class RegistrationFactory {

  public static Dataset createDataset(String catalogId) {
    Dataset dataset = new Dataset();

    dataset.setId(UUID.randomUUID().toString());
    dataset.setUri(getCatalogUri(catalogId) + "/datasets/" + dataset.getId());
    dataset.setCatalogId(catalogId);

    return dataset;
  }

  public static ApiSpecification createApiSpecification(String catalogId) {
    ApiSpecification apiSpecification = new ApiSpecification();

    apiSpecification.setId(UUID.randomUUID().toString());
    apiSpecification.setApiSpecUrl(
        getCatalogUri(catalogId) + "/apispecs/" + apiSpecification.getId());
    apiSpecification.setCatalogId(catalogId);

    return apiSpecification;
  }

  public static Contact createContact(String catalogId) {
    Contact contact = new Contact();
    contact.setId(UUID.randomUUID().toString());
    contact.setUri(getCatalogUri(catalogId) + "/contacts/" + contact.getId());

    return contact;
  }

  public static Distribution createDistribution(String catalogId, String datasetId) {
    Distribution distribution = new Distribution();
    distribution.setId(UUID.randomUUID().toString());
    distribution.setUri(
        getDatasetUri(catalogId, datasetId) + "/distributions/" + distribution.getId());

    return distribution;
  }

  public static String getCatalogUri(String catalogId) {
    return "http://brreg.no" + "/catalogs/" + catalogId;
  }

  public static String getDatasetUri(String catalogId, String datasetId) {
    return getCatalogUri(catalogId) + "/datasets/" + datasetId;
  }

  public static String getContactUri(String catalogId, String contactId) {
    return getCatalogUri(catalogId) + "/contacts/" + contactId;
  }

  public static String getDistributionUri(Distribution distribution, Dataset parentDataset) {
    return parentDataset.getUri() + "/distributions/" + distribution.getId();
  }
}
