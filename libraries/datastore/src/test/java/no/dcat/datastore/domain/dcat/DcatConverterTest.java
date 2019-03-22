package no.dcat.datastore.domain.dcat;

import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.dcat.shared.SkosConcept;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.RDFDataMgr;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(UnitTest.class)
public class DcatConverterTest {
    static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    private static Logger logger = LoggerFactory.getLogger(DcatConverterTest.class);

    public DcatReader setupReader(Model model) {
        return new DcatReader(model);
    }

    @Test
    public void readNAVRegistrationAPI() throws Throwable {

        Model model = RDFDataMgr.loadModel("nav-2017-10-31.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(42));

    }


    @Test
    public void readRamsundContactInfoOK() throws Throwable {

        Model model = RDFDataMgr.loadModel("ramsund.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();
        int[] contactCount = {0};
        datasets.forEach(dataset -> {
            if (dataset.getContactPoint() != null)
                for (Contact contact : dataset.getContactPoint()) {
                    if (contact != null) {
                        contactCount[0]++;

                        logger.info(contact.getEmail());
                    }

                }
        });
        assertThat(contactCount[0], is(3));
        assertThat(datasets.size(), is(4));

    }


    @Test
    public void readDifiData() throws Throwable {

        Model model = RDFDataMgr.loadModel("difi-dataset-2017-10-19.jsonld");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(33));

        final int[] t = {0};
        datasets.forEach(dataset -> {
            if (dataset.getTemporal() != null) {
                dataset.getTemporal().forEach(temporal -> {
                    t[0]++;
                    logger.info("{}: {} - {}", dataset.getUri(), sdf.format(temporal.getStartDate()), sdf.format(temporal.getEndDate()));
                });
            }
        });

        assertThat("has temporals", t[0], is(10));
    }


    @Test
    public void readGeonorgeData() throws Throwable {

        Model model = RDFDataMgr.loadModel("geonorge-data-2017-10-19.xml");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(168));

    }

    @Test
    public void readReinliDataForQualityAnnotation() throws Throwable {
        Model model = RDFDataMgr.loadModel("reinli-data-2017-10-26.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(1));

        Dataset dataset = datasets.get(0);

        assertThat(dataset.getHasAvailabilityAnnotation().getHasBody().get("no"), is("Dette er tilgjengelig"));
        assertThat(dataset.getHasCurrentnessAnnotation().getHasBody().get("no"), is("Dette er ikke aktuelt"));
        assertThat(dataset.getHasCompletenessAnnotation().getHasBody().get("no"), is("Dette er komplett"));
        assertThat(dataset.getHasAccuracyAnnotation().getHasBody().get("no"), is("Dette er nøyaktig"));
        assertThat(dataset.getHasRelevanceAnnotation().getHasBody().get("no"), is("Dette er relevant"));
    }


    @Test
    public void readGdocData() throws Throwable {

        Model model = RDFDataMgr.loadModel("gdoc-data-2017-10-19.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(132));

    }


    @Test
    public void readDistributionOK() throws Throwable {

        Model model = RDFDataMgr.loadModel("dataset-with-distribution.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();
        String actualDescription = datasets.get(0).getDistribution().get(0).getDescription().get("nb");

        assertThat(actualDescription, is("En vanlig distribusjon"));
    }


    @Test
    public void readApiDistributionOK() throws Throwable {

        Model model = RDFDataMgr.loadModel("dataset-with-api-distribution.ttl");

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        String actualApiDescription = datasets.get(0).getDistribution().get(0)
            .getAccessService().getDescription().get("nb");

        SkosConcept endpointDescription = datasets.get(0).getDistribution().get(0)
            .getAccessService().getEndpointDescription().get(0);

        assertThat(actualApiDescription, is("Åpne Data fra Enhetsregisteret - API Dokumentasjon"));
        assertThat(endpointDescription.getExtraType(), is("http://xmlns.com/foaf/0.1/Document"));
        assertThat(endpointDescription.toString().contains("93b125a8-c68c-4d65-8b16-6b45b9453be4"), is(true));
    }

}
