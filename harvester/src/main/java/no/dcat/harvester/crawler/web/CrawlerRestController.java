package no.dcat.harvester.crawler.web;

import no.dcat.harvester.crawler.Crawler;
import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.CrawlerJobFactory;
import no.dcat.harvester.settings.FusekiSettings;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class CrawlerRestController {

    @Autowired
    private FusekiSettings fusekiSettings;
    private AdminDataStore adminDataStore;

    private final Logger logger = LoggerFactory.getLogger(CrawlerRestController.class);

    @Autowired
    private Crawler crawler;

    @Autowired
    private CrawlerJobFactory crawlerJobFactory;

    @PostConstruct
    public void initialize() {
        adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
    }

    @RequestMapping("/api/admin/harvest")
    public void harvestDataSoure(@RequestParam(value = "id") String dcatSourceId) {
        logger.debug("Received request to harvest {}", dcatSourceId);
        Optional<DcatSource> dcatSource = adminDataStore.getDcatSourceById(dcatSourceId);
        if (dcatSource.isPresent()) {
            CrawlerJob job = crawlerJobFactory.createCrawlerJob(dcatSource.get());
            crawler.execute(job);
        } else {
            logger.warn("No stored dcat source {}", dcatSource.toString());
        }
    }

    @RequestMapping("/api/admin/harvest-all")
    public void harvestDataSoure() {
        logger.debug("Received request to harvest all dcat sources");


        List<DcatSource> dcatSources = adminDataStore.getDcatSources();
        for (DcatSource dcatSource : dcatSources) {
            CrawlerJob job = crawlerJobFactory.createCrawlerJob(dcatSource);
            crawler.execute(job);
        }
        logger.debug("Finished all crawler jobs");
    }
}