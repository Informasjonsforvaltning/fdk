package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.converters.BrregAgentConverter;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

/**
 * Created by nodavsko on 29.09.2016.
 */
@RunWith(SpringRunner.class)
@EnableConfigurationProperties
public class LoadExampleData {

    

    @Test
    public void createExampleData() throws IOException {

        loadDatasetFromFile("dataset-test.ttl");

        /*
        //loadDatasetFromFile("test_entryscape_brreg.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_nav.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_fiskeridirektoratet.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_kartverket.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_statenspensjonskasse.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_geonorge.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_fiskeridirektoratet.jsonld.rdf");
        loadDatasetFromFile("test_entryscape_statensvegvesen.jsonld.rdf");
        */

    }

    public void loadDatasetFromFile(String filename) {
        ClassLoader classLoader = getClass().getClassLoader();

        //Load themes from url
        SkosLoader sl = new SkosLoader();
        String[] args = new String[1];
        args[0] = "http://publications.europa.eu/mdr/resource/authority/data-theme/skos/data-theme-skos.rdf";
        sl.main(args);

        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", classLoader.getResource(filename).getFile(), "admin_user", "123456789");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        Mockito.doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(Mockito.anyObject(), Mockito.anyObject());

        //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
        ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler("192.168.99.100",9300);

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, esHandler);


        job.run();
    }
}
