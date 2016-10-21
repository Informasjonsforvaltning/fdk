package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;


import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by nodavsko on 29.09.2016.
 */

public class Loader {

    public static void main(String[] args) {

        String file = args[0];

        Loader loader = new Loader();

        //URL url = loader.getClass().getClassLoader().getResource(file);

        //loader.loadDatasetFromFile(url.toString());
        loader.loadDatasetFromFile(file);
    }

    public void loadDatasetFromFile(String filename) {
        URL url;
        try {
             url = new URL(filename);
            DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");


            //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
            ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler("localhost",9300);


            CrawlerJob job = new CrawlerJob(dcatSource, null, null, esHandler);


            job.run();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }


    }
}
