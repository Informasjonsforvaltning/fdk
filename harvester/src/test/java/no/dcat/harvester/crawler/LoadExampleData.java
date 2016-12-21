package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.List;

/**
 * Created by nodavsko on 29.09.2016.
 */
@RunWith(SpringRunner.class)
@EnableConfigurationProperties
public class LoadExampleData {

    private final Logger logger = LoggerFactory.getLogger(CrawlerJob.class);

    @Test
    public void createExampleData() throws IOException {

        loadDatasetFromFile("dataset-FDK-138-validering.ttl");

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

        List<String> valres = job.getValidationResult();

        logger.debug("loader job summary: ");
        int i = 1;
        for (String res : valres) {
            logger.debug("vaidation result " + i +": " + res);
            i++;
        }

    }
}
