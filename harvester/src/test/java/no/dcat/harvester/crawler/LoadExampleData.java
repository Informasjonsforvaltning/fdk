package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
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

    }

    public void loadDatasetFromFile(String filename) {
        ClassLoader classLoader = getClass().getClassLoader();

        //TODO: putte dette i properties
        //Elasticsearch clustername on local: elasticsearch. On Openshift: fellesdatakatalog

        String elasthcSearchHost = "192.168.99.100";
        int port = 9300;
        String clustername = "elasticsearch";

        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", classLoader.getResource(filename).getFile(), "admin_user", "123456789");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        Mockito.doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(Mockito.anyObject(), Mockito.anyObject());

        //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
        ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler(elasthcSearchHost,port, clustername);

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, esHandler);


        job.run();
    }
}
