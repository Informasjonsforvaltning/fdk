package no.dcat.harvester.crawler;



import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RiotException;
import org.apache.jena.shared.BadURIException;
import org.apache.jena.util.FileManager;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mockito;

import java.io.File;
import java.io.IOException;

import static org.springframework.test.util.AssertionErrors.assertTrue;

public class CrawlerJobTest {


    @Test
    public void testBRREGCrawlerJob() throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", classLoader.getResource("brreg.jsonld").getFile(), "tester", "123456789");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        Mockito.doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(Mockito.anyObject(), Mockito.anyObject());

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);


        job.run();


    }

    @Test
    public void testCrawlerJob() throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();


        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", classLoader.getResource("npolar.jsonld").getFile(), "tester", "123456789");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        Mockito.doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(Mockito.anyObject(), Mockito.anyObject());

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);


        job.run();

    }


    @Test
    public void testCrawlerResultHandlerWithNoException() {
        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", "src/test/resources/npolar.jsonld", "tester", null);

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, adminDataStore);

        handler.process(dcatSource, ModelFactory.createDefaultModel());
    }


    @Test
    public void testCrawlerJobWithInvalidDataset() {
        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", "src/test/resources/dataset-FDK-138-validering.ttl", "tester", "");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        FusekiResultHandler handler = new FusekiResultHandler(dcatDataStore, null);

        handler.process(dcatSource, ModelFactory.createDefaultModel());

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);
        job.run();
    }



    @Test
    @Ignore
    public void testCrawlerJobFromEntryscape() throws IOException {

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("entryscape.jsonld").getFile());

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", file.getCanonicalPath(), "tester", "");

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        FusekiResultHandler handler = Mockito.mock(FusekiResultHandler.class);


        final boolean[] didRun = {false};
        Mockito.doAnswer(invocationOnMock -> {
            didRun[0] = true;
            return null;
        }).when(handler).process(Mockito.anyObject(), Mockito.any());


        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);
        job.run();

        assertTrue("The entryscape file was invalid. Should have been enriched and validated, so that the handler would run.", didRun[0]);
    }

    @Test
    @Ignore
    public void testCrawlerJobFromVegesenet() throws IOException {

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("vegvesenet.xml").getFile());

        DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", file.getCanonicalPath(), "tester", "");

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        FusekiResultHandler handler = Mockito.mock(FusekiResultHandler.class);


        final boolean[] didRun = {false};
        Mockito.doAnswer(invocationOnMock -> {
            didRun[0] = true;
            return null;
        }).when(handler).process(Mockito.anyObject(), Mockito.any());


        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, handler);
        job.run();

        assertTrue("The Vegvesenet file was invalid. Should have been enriched and validated, so that the handler would run.", didRun[0]);
    }

    @Test(expected = RiotException.class)
    public void testCrawlingJsonLdWithSpaceInUri() throws IOException {

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("space-in-uri.jsonld").getFile());

        FusekiResultHandler handler = Mockito.mock(FusekiResultHandler.class);

        CrawlerJob job = new CrawlerJob(null, null, null, handler);
        job.verifyModelByParsing(FileManager.get().loadModel(file.getCanonicalPath()));
        job.run();

    }

    @Test(expected = BadURIException.class)
    public void testCrawlingXmlRdfWithSpecialCharacterInUri() throws IOException {

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("dcat-11.xml").getFile());

        FusekiResultHandler handler = Mockito.mock(FusekiResultHandler.class);

        CrawlerJob job = new CrawlerJob(null, null, null, handler);

        job.verifyModelByParsing(FileManager.get().loadModel(file.getCanonicalPath()));

    }


}
