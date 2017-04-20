package no.dcat.harvester.crawler;

import no.dcat.admin.store.AdminDataStore;
import no.dcat.admin.store.DcatDataStore;
import no.dcat.admin.store.domain.DcatSource;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import org.junit.Test;
import org.mockito.Mockito;

import java.io.IOException;

/**
 * Created by nodavsko on 29.09.2016.
 */
public class LoadFinished {

    @Test
    public void createExampleData() throws IOException {
        loadDatasetFromFile("finished.ttl");

    }

    public void loadDatasetFromFile(String filename) {
        ClassLoader classLoader = getClass().getClassLoader();

        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", classLoader.getResource(filename).getFile(), "admin_user", "123456789");

        DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
        Mockito.doThrow(Exception.class).when(dcatDataStore).saveDataCatalogue(Mockito.anyObject(), Mockito.anyObject());

        //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
        ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler("localhost",9300, "elasticsearch");

        AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

        CrawlerJob job = new CrawlerJob(dcatSource, adminDataStore, null, esHandler);


        job.run();
    }
}
