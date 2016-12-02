package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.handlers.ElasticSearchSkosResultHandler;
import no.difi.dcat.datastore.domain.DcatSource;

/**
 * Class for loading themes into elasticsearch. The rdf-formated Themes are retrieved from an URL.
 */
public class SkosLoader {

    public static void main(String[] args) {
        // TODO: the hard coded values shall be parametrized.
        String skosUrl = "http://publications.europa.eu/mdr/resource/authority/data-theme/skos/data-theme-skos.rdf";
        //String skosUrl = args[0];
        String clustername = "fellesdatakatalog";

        ElasticSearchSkosResultHandler esSkosHandler = new ElasticSearchSkosResultHandler("localhost", 9300, clustername);
        DcatSource themeSource = new DcatSource("http//dcat.no/test", "Test", skosUrl, "admin_user", "123456789");

        CrawlerSkosJob job = new CrawlerSkosJob(themeSource, null, skosUrl, esSkosHandler);
        job.run();
    }
}
