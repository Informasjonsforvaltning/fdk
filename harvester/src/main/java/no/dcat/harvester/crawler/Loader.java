package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.Application;
import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultPubHandler;
import no.dcat.harvester.settings.ApplicationSettings;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;


import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

/**
 * Created by nodavsko on 29.09.2016.
 */

public class Loader {

    @Autowired
    private ApplicationSettings applicationSettings;

    //TODO: sende disse som parametre? Må vurderes
    @Value("${application.elasticSearchHost}")
    private String elasticSearchHost;

    @Value("${application.elasticSearchPort}")
    private int elasticSearchPort;

    @Value("${application.elasticSearchCluster}")
    private String elasticSearchCluster;



    private static Logger logger = LoggerFactory.getLogger(Loader.class);

    public static void main(String[] args) {



        String file = args[0];


        Loader loader = new Loader();

        //URL url = loader.getClass().getClassLoader().getResource(file);

        //loader.loadDatasetFromFile(url.toString());
        loader.loadDatasetFromFile(file);
    }

    public List<String> loadDatasetFromFile(String filename) {
        URL url;
        try {
             url = new URL(filename);
            DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");

            logger.debug("loadDatasetFromFile: filename: " + filename);
            logger.debug("loadDatasetFromFile: elasticsearch host: " + elasticSearchHost);
            logger.debug("loadDatasetFromFile: elasticsearch port: " + elasticSearchPort);
            logger.debug("loadDatasetFromFile: elasticsearch cluster: " +elasticSearchCluster);


            //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
            ElasticSearchResultHandler esHandler = new ElasticSearchResultHandler(
                    elasticSearchHost,
                    elasticSearchPort,
                    elasticSearchCluster);

            LoadingCache<URL, String> brregCach = Application.getBrregCache();
            CrawlerJob job = new CrawlerJob(dcatSource, null, brregCach, esHandler);

            job.run();

            ElasticSearchResultPubHandler publisherHandler = new ElasticSearchResultPubHandler(
                    elasticSearchHost,
                    elasticSearchPort,
                    elasticSearchCluster;
            CrawlerPublisherJob jobER = new CrawlerPublisherJob(dcatSource, null, brregCach, publisherHandler);

            jobER.run();

            return job.getValidationResult();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        return null;

    }
}
