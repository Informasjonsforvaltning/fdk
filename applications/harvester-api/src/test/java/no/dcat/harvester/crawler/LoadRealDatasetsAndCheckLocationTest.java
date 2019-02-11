package no.dcat.harvester.crawler;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.DcatDataStore;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.builders.RdfModelLoader;
import no.dcat.datastore.domain.dcat.client.RetrieveCodes;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.shared.SkosCode;
import no.fdk.test.testcategories.UnitTest;
import org.apache.commons.io.IOUtils;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.vocabulary.DCTerms;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.powermock.api.mockito.PowerMockito.*;

/**
 * Created by bgrova on 11.10.2016.
 * Modified by nodavsk on 30.05.2018
 */
@RunWith(PowerMockRunner.class)
@PowerMockIgnore({"java.lang.*",
    "javax.management.*", "javax.security.*", "javax.xml.*",
    "org.apache.xerces.*",
    "ch.qos.logback.*", "org.slf4j.*", "org.apache.logging.log4j.*",
    "org.apache.jena.*", "org.apache.xerces.*", "com.sun.org.*"})
@PrepareForTest({RetrieveCodes.class, ElasticSearchResultHandler.class, CrawlerJob.class})
@Category(UnitTest.class)
@Ignore
public class LoadRealDatasetsAndCheckLocationTest {
    private static Logger logger = LoggerFactory.getLogger(LoadRealDatasetsAndCheckLocationTest.class);

    @Test
    public void loadMiniDataset() throws Exception {

        CrawlerJob job = loadDatasetFromFile("datasett-mini.ttl");
        assertThat(job.getDatasetsInError().size(), is(0));
    }

    @Test
    public void loadFinishedDataset() throws Exception {

        CrawlerJob job = loadDatasetFromFile("finished.ttl");
        assertThat(job.getDatasetsInError().size(), is(1));
    }

    @Test
    public void loadExampleData() throws Exception {

        CrawlerJob job = loadDatasetFromFile("dataset-FDK-138-validering.ttl");
        assertThat(job.getDatasetsInError().size(), is(1));
    }

    @Ignore
    //temporarily disable this. Should be enabled, but a UnitTest should not fetch resources from data.geonorge.no (which this test ends up doing)
    @Test
    public void loadDatanorgeData() throws Exception {

        CrawlerJob job = loadDatasetFromFile("datanorge_2018_05_31.jsonld");
        assertThat(job.getDatasetsInError().size(), is(0));
    }

    public CrawlerJob loadDatasetFromFile(String filename) throws Exception {
        Resource resource = new ClassPathResource(filename);

        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", resource.getURL().toString(), "admin_user", "123456789");

        DcatDataStore dcatDataStore = mock(DcatDataStore.class);
        doThrow(RuntimeException.class).when(dcatDataStore).saveDataCatalogue(any(), any());

        mockStatic(RetrieveCodes.class);
        Map<String, Map<String, SkosCode>> locationCodes = extractLocationCodes(resource, getCodes());
        when(RetrieveCodes.getAllCodes(anyString())).thenReturn(locationCodes);

        ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler("localhost:9300", "elasticsearch", "http://localhost:8100", "user", "password");
        AdminDataStore adminDataStore = mock(AdminDataStore.class);
        ElasticSearchResultHandler spyHandler = spy(esHandler);
        doNothing().when(spyHandler, "updateDatasets", any(), any(), any(), any(), any(), any(), any());

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, spyHandler);
        CrawlerJob spyJob = spy(job);
        doReturn(true).when(spyJob).locationUriResponds(anyString());

        spyJob.testMode();

        spyJob.run();

        return spyJob;
    }

    private Map<String, Map<String, SkosCode>> extractLocationCodes(Resource resource, Map<String, Map<String, SkosCode>> codes) throws IOException {
        if (codes.get("location") == null) {
            codes.put("location", new HashMap<>());
        }

        Model model = RDFDataMgr.loadModel(resource.getFilename());

        ResIterator resIterator = model.listResourcesWithProperty(DCTerms.spatial);

        while (resIterator.hasNext()) {
            org.apache.jena.rdf.model.Resource datasetResource = resIterator.nextResource();

            StmtIterator statementIterator = datasetResource.listProperties(DCTerms.spatial);

            while (statementIterator.hasNext()) {
                Statement statement = statementIterator.next();

                if (statement.getObject().isURIResource()) {
                    String uri = statement.getObject().asResource().getURI();
                    if (!codes.get("location").containsKey(uri)) {

                        Model locationModel = RdfModelLoader.loadModel(new URL(uri));
                        org.apache.jena.rdf.model.Resource locationResource = locationModel.getResource(uri);

                        SkosCode code = DatasetBuilder.extractLocation(locationResource);

                        if (code != null) {
                            codes.get("location").put(code.getUri(), code);
                            logger.info("Lookup location: {} -> {}", uri, code.getPrefLabel().get("no"));
                        } else {
                            logger.info("Lookup location: {} -> failed!", uri);
                        }

                    }
                }
            }
        }

        return codes;
    }

    private Map<String, Map<String, SkosCode>> getCodes() throws IOException {
        Resource resource = new ClassPathResource("all_codes.json");

        Gson gson = new Gson();
        String text = IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8);
        Type type = new TypeToken<Map<String, Map<String, SkosCode>>>() {
        }.getType();

        return gson.fromJson(text, type);
    }
}
