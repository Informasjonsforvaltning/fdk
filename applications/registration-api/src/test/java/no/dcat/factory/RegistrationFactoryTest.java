package no.dcat.factory;

import no.dcat.model.Dataset;
import no.dcat.shared.Contact;
import no.dcat.shared.Distribution;
import org.junit.Test;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
/**
 * Created by bjg on 02.05.2018.
 */
public class RegistrationFactoryTest {

    @Test
    public void datasetCreatedWithCorrectUri() throws Exception {
        String catalogId = "12345";
        Dataset result = RegistrationFactory.createDataset(catalogId);

        assertThat(result.getUri(), containsString("http://brreg.no/catalogs/" + catalogId + "/datasets/"));

    }

    @Test
    public void contactCreatedWithCorrectUri() throws Exception {
        String catalogId = "23456";
        Contact result = RegistrationFactory.createContact(catalogId);

        assertThat(result.getUri(), containsString("http://brreg.no/catalogs/" + catalogId + "/contacts/"));
    }

    @Test
    public void distributionCreatedWithCorrectUri() throws Exception {
        String catalogId = "98765";
        String datasetId = "12345";
        Distribution result = RegistrationFactory.createDistribution(catalogId, datasetId);

        assertThat("distribution uri is correct", result.getUri(), containsString("http://brreg.no/catalogs/" + catalogId
                + "/datasets/" + datasetId + "/distributions/"));
    }

    @Test
    public void getContactUriIsCorrect() throws Exception {
        String result = RegistrationFactory.getContactUri("111", "222");
        assertThat(result, is("http://brreg.no/catalogs/111/contacts/222"));
    }

    @Test
    public void getDistributionUriIsCorrect() throws Exception {
        Dataset dataset = RegistrationFactory.createDataset("111");
        Distribution distribution = RegistrationFactory.createDistribution("111", "222");
        String result = RegistrationFactory.getDistributionUri(distribution, dataset);
        assertThat(result, is("http://brreg.no/catalogs/111/datasets/"
                + dataset.getId() +"/distributions/" + distribution.getId()));
    }
}
