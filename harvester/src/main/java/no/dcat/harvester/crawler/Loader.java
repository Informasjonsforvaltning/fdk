package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.HarvesterApplication;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultPubHandler;
import no.dcat.harvester.crawler.handlers.CodeCrawlerHandler;
import no.difi.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.concurrent.Future;

/**
 * Created by nodavsko on 29.09.2016.
 */

public class Loader {

    private final String DEFAULT_ELASTICSEARCH_HOST = "localhost";
    private final int DEFAULT_ELASTICSEARCH_PORT = 9300;
    private final String DEFAULT_ELASTICSEARCH_CLUSTER = "elasticsearch";

    private static Logger logger = LoggerFactory.getLogger(Loader.class);
  
    private String hostname;
    private int port;
    private String elasticsearchCluster;


    public Loader() {
        hostname = DEFAULT_ELASTICSEARCH_HOST;
        port = DEFAULT_ELASTICSEARCH_PORT;
        elasticsearchCluster = DEFAULT_ELASTICSEARCH_CLUSTER;

    }

    public Loader(String hostname, int port ) {
        this.hostname = hostname;
        this.port = port;
        this.elasticsearchCluster = DEFAULT_ELASTICSEARCH_CLUSTER;
    }
  
    public Loader(String hostname, int port, String cluster ) {
        this.hostname = hostname;
        this.port = port;
        this.elasticsearchCluster = cluster;
    }
  

    public static void main(String[] args) {

        String file = args[0];


        Loader loader = new Loader();

        //URL url = loader.getClass().getClassLoader().getResource(file);

        //loader.loadDatasetFromFile(url.toString());
        loader.loadDatasetFromFile(file);
    }


    /**
     * Load dataset from file into elasticsearch instance on localhost
     *
     * @param filename filename to be loaded. Must be a valid DCAT file
     * @return list of strings containing validation result for DCAT file
     */
    public List<String> loadDatasetFromFile(String filename) {
        //Kompatibilitetsmetode - sikrer kompatibiltet med opprinnelig metodesignator

        return loadDatasetFromFile(filename, this.hostname, this.port, this.elasticsearchCluster);
    }


    /**
     * Load dataset from file into specified elasticsearch instance
     *
     * @param filename file to be loaded into elasticsearch. Must be a valid DCAT file
     * @param elasticSearchHost hostname of elasticsearch server
     * @param elasticSearchPort port where elasticsearch cluster is reached. Usually 9300
     * @param elasticSearchCluster name of elasticsearch cluster.
     * @return list of strings containing validation result for DCAT file
     */
    public List<String> loadDatasetFromFile(String filename, String elasticSearchHost, int elasticSearchPort, String elasticSearchCluster) {
        URL url;
        
        this.hostname = elasticSearchHost;
        this.port = elasticSearchPort;
        this.elasticsearchCluster = elasticSearchCluster;
        
      
        try {

            logger.debug("loadDatasetFromFile: filename: " + filename);
            logger.debug("loadDatasetFromFile: elasticsearch host: " + elasticSearchHost);
            logger.debug("loadDatasetFromFile: elasticsearch port: " + elasticSearchPort);
            logger.debug("loadDatasetFromFile: elasticsearch cluster: " +elasticSearchCluster);

            url = new URL(filename);
            DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");

            // Load all codes.
            harvestAllCodes(true);

            //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
            CrawlerResultHandler esHandler = new ElasticSearchResultHandler(this.hostname, this.port, this.elasticsearchCluster);
            CrawlerResultHandler publisherHandler = new ElasticSearchResultPubHandler(this.hostname,this.port, this.elasticsearchCluster);

            LoadingCache<URL, String> brregCach = HarvesterApplication.getBrregCache();
            CrawlerJob job = new CrawlerJob(dcatSource, null, brregCach, esHandler, publisherHandler);

            job.run();

            return job.getValidationResult();

        } catch (MalformedURLException e) {
           logger.error("URL not valid: {} ", filename,e);
        } catch (InterruptedException e) {
            logger.error("Interrupted: {}",e.getMessage());
        }

        return null;
    }
    private void harvestAllCodes(boolean reload) throws InterruptedException {
        for(Types type:Types.values()) {
            logger.debug("Loading type {}", type);
            harvestCode(reload, type.getSourceUrl(), type.getType());
        }
    }

    private void harvestCode(boolean reload, String sourceURL, String indexType) throws InterruptedException {
        CrawlerResultHandler codeHandler = new CodeCrawlerHandler(this.hostname, this.port, this.elasticsearchCluster, indexType, reload);
        CrawlerCodeJob jobCode = new CrawlerCodeJob(sourceURL, codeHandler);

        jobCode.run();
    }
}
