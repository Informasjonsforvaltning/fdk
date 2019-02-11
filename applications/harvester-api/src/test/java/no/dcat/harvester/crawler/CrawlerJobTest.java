package no.dcat.harvester.crawler;

import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.DcatDataStore;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.dcat.harvester.validation.ValidationError;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RiotException;
import org.apache.jena.shared.BadURIException;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@Category(UnitTest.class)
public class CrawlerJobTest {
    private static Logger logger = LoggerFactory.getLogger(CrawlerJobTest.class);


    @Test
    public void testLastPath() {
        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", "https://test", "tester", "123456789");
        AdminDataStore adminDataStore = mock(AdminDataStore.class);
        ElasticSearchResultHandler elasticHandler = mock(ElasticSearchResultHandler.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, elasticHandler);
        job.testMode();

        String actual = job.lastPath("/p1/p2");
        assertThat(actual, is("p2"));

        assertThat(job.lastPath("/"), is(""));

        assertThat(job.lastPath(""), is(""));

        assertThat(job.lastPath(null), is(nullValue()));
    }

    @Test
    public void testErrorFormat() {

        ValidationError error = new ValidationError("Catalog",
            1, ValidationError.RuleSeverity.warning,
            "description", "message", null, null, null);

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", "https://test", "tester", "123456789");
        AdminDataStore adminDataStore = mock(AdminDataStore.class);
        ElasticSearchResultHandler elasticHandler = mock(ElasticSearchResultHandler.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, elasticHandler);
        job.testMode();

        String actual = job.formatValidationMessage(error);

        assertThat(actual, is("[warning] Catalog. Rule 1: description"));

        Resource node = mock(Resource.class);

        when(node.getURI()).thenReturn("http://subject");
        when(node.isURIResource()).thenReturn(true);
        when(node.asResource()).thenReturn(node);

        ValidationError error2 = new ValidationError("Catalog",
            1, ValidationError.RuleSeverity.warning,
            "description", "message", node, null, null);

        assertThat(job.formatValidationMessage(error2), is("[warning] Catalog <http://subject>. Rule 1: description"));

        when(node.getURI()).thenReturn("file://file/path");

        assertThat(job.formatValidationMessage(error2), is("[warning] Catalog <path>. Rule 1: description"));

        when(node.getURI()).thenReturn("path");

        assertThat(job.formatValidationMessage(error2), is("[warning] Catalog path. Rule 1: description"));

    }

    @Test
    public void testBRREGCrawlerJob() throws IOException {
        ClassPathResource resource = new ClassPathResource("brreg.jsonld");

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", resource.getURL().toString(), "tester", "123456789");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        doThrow(RuntimeException.class).when(dcatDataStore).saveDataCatalogue(any(), any());

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);

        job.testMode();
        job.run();

    }

    @Test
    public void testDIFICrawlerJob() throws IOException {

        ClassPathResource resource = new ClassPathResource("difi-dataset-2017-10-19.jsonld");

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", resource.getURL().toString(), "tester", "123456789");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        doThrow(RuntimeException.class).when(dcatDataStore).saveDataCatalogue(any(), any());

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);

        CrawlerJob spyJob = spy(job);
        doReturn(job.loadModelAndValidate(resource.getURL())).when(spyJob).prepareModelForValidation();
        spyJob.testMode();
        spyJob.run();

        List<String> report = spyJob.getValidationResult();

        logger.debug("validation report: {}", report);
        assertThat(report.size(), is(42));
    }


    @Test(expected = FileNotFoundException.class)
    public void testCrawlerJobInvalidUrl() throws IOException {
        ClassPathResource resource = new ClassPathResource("npolar.json");

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", resource.getURL().toString(), "tester", "123456789");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(any(), any());

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);

        job.testMode();
        job.run();

    }


    @Test
    public void testCrawlerResultHandlerWithNoException() throws Throwable {
        ClassPathResource resource = new ClassPathResource("npolar.jsonld");
        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", resource.getURL().toString(), "tester", null);

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, adminDataStore);

        handler.process(dcatSource, ModelFactory.createDefaultModel(), null);
    }


    @Test
    public void testCrawlerJobWithInvalidDataset() throws Throwable {
        ClassPathResource resource = new ClassPathResource("dataset-FDK-138-validering.ttl");
        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", resource.getURL().toString(), "tester", "");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        handler.process(dcatSource, ModelFactory.createDefaultModel(), null);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);
        job.testMode();
        job.run();
    }

    @Test
    public void testCrawlingOfRegistrationWithBRREG() throws Throwable {
        ClassPathResource resource = new ClassPathResource("brreg-from-registration.ttl");

        DcatSource dcatSource = new DcatSource("http://someid", "Test", resource.getURL().toString(), "tester", "123");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        AdminDataStore adminDataStore = mock(AdminDataStore.class);

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        handler.process(dcatSource, ModelFactory.createDefaultModel(), null);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);
        job.testMode();
        job.run();

        Model actualModel = job.getModel();

        ResIterator iterator = actualModel.listResourcesWithProperty(RDF.type, FOAF.Agent);
        int count = 0;
        List<String> orgPats = new ArrayList<>();

        while (iterator.hasNext()) {
            Resource r = iterator.next();
            orgPats.add(r.getProperty(DCATNO.organizationPath).getObject().asLiteral().getString());
            logger.info(r.getURI());
            count++;
        }

        assertThat("Dataset should only have two Agents", count, is(2));

        assertThat(orgPats.contains("/STAT/912660680"), is(true));
        assertThat(orgPats.contains("/STAT/912660680/974760673"), is(true));

    }

    @Test(expected = RiotException.class)
    public void testCrawlingJsonLdWithSpaceInUri() throws Throwable {
        ClassPathResource resource = new ClassPathResource("space-in-uri.jsonld");

        FusekiResultHandler handler = mock(FusekiResultHandler.class);

        CrawlerJob job = new CrawlerJob(null, null, null, handler);
        job.verifyModelByParsing(FileManager.get().loadModel(resource.getFile().getCanonicalPath()));
        job.run();

    }

    @Test(expected = BadURIException.class)
    public void testCrawlingXmlRdfWithSpecialCharacterInUri() throws IOException {
        ClassPathResource resource = new ClassPathResource("dcat-11.xml");


        FusekiResultHandler handler = mock(FusekiResultHandler.class);

        CrawlerJob job = new CrawlerJob(null, null, null, handler);

        job.verifyModelByParsing(FileManager.get().loadModel(resource.getFile().getCanonicalPath()));

    }


}
