package no.dcat.harvester.crawler;

import no.dcat.shared.Catalog;
import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DcatReader;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.util.FileManager;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Iterator;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

public class DcatSourcesConverterIT {
    private static Logger logger = LoggerFactory.getLogger(DcatSourcesConverterIT.class);
    static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public DcatReader setupReader(Model model) {
        return new DcatReader(model, "http://localhost:8100", "user", "password");
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
        datasets.forEach(dataset ->{
            if (dataset.getContactPoint() != null)
            for (Contact contact : dataset.getContactPoint()) {
                if (contact != null) {
                    contactCount[0]++;
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
                dataset.getTemporal().forEach( temporal -> {
                    t[0]++;
                   logger.info("{}: {} - {}", dataset.getUri(), sdf.format(temporal.getStartDate()), sdf.format(temporal.getEndDate()));
                });
            }
        });

        assertThat("has temporals", t[0], is(10));
    }

    @Test
    public void readCompleteDifiData() throws Throwable {

        Resource r = new ClassPathResource("difi-complete-2017-10-25.jsonld");
        Model model = new CrawlerJob(null,null,null).loadModelAndValidate(r.getURL());

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        datasets.forEach(dataset -> {
            if (dataset.getDistribution() != null) {
                dataset.getDistribution().forEach( distribution -> {
                    logger.debug("{}: {}", dataset.getUri(), distribution.getFormat());
                    if (distribution.getFormat() != null && distribution.getFormat().size() > 0) {
                        String firstFormat = distribution.getFormat().get(0);
                        assertThat(firstFormat, is(notNullValue()));
                    }

                });
            }
        });

        assertThat(datasets.size() , is(484));
    }

    @Test
    public void readGeonorgeData() throws Throwable {

        Model model = RDFDataMgr.loadModel("geonorge-data-2017-10-19.xml" );

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

        Model model = RDFDataMgr.loadModel("gdoc-data-2017-10-19.ttl" );

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        assertThat(datasets.size(), is(132));

    }

}