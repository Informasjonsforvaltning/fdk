package no.dcat.harvester.crawler.web;

import no.dcat.harvester.crawler.*;
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
import java.util.concurrent.Future;

@RestController
@CrossOrigin(origins = "*")
public class CrawlerRestController {

    public static final int SLEEP = 1000;
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
    public void harvestDataSoure(@RequestParam(value = "id") String dcatSourceId) throws InterruptedException {
        logger.debug("Received request to harvest {}", dcatSourceId);

        logger.debug("Load Codes.");
        boolean reload = false;
        harvestAllCodes(reload);

        logger.debug("Harvest datasset.");
        Optional<DcatSource> dcatSource = adminDataStore.getDcatSourceById(dcatSourceId);
        if (dcatSource.isPresent()) {
            CrawlerJob job = crawlerJobFactory.createCrawlerJob(dcatSource.get());
            crawler.execute(job);
        } else {
            logger.warn("No stored dcat source {}", dcatSource.toString());
        }
    }

    @RequestMapping("/api/admin/harvest-all")
    public void harvestDataSoure() throws InterruptedException {
        logger.debug("Received request to harvest all dcat sources");

        logger.debug("Reload Codes.");
        boolean reload = true;
        harvestAllCodes(reload);

        logger.debug("Harvest all dcat sources");
        List<DcatSource> dcatSources = adminDataStore.getDcatSources();
        for (DcatSource dcatSource : dcatSources) {
            CrawlerJob job = crawlerJobFactory.createCrawlerJob(dcatSource);
            crawler.execute(job);
        }
        logger.debug("Finished all crawler jobs");
    }

    private void harvestAllCodes(boolean reload) throws InterruptedException {
        for(Types type:Types.values()) {
            logger.debug("Loading type {}", type);
            harvestCode(reload, type.getSourceUrl(), type.getType());
        }
    }

    private void harvestCode(boolean reload, String sourceURL, String indexType) throws InterruptedException {
        CrawlerCodeJob jobCode = crawlerJobFactory.createCrawlerCodeJob(sourceURL, indexType, reload);
        Future future = crawler.execute(jobCode);

        while (!future.isDone()) {
            logger.info("Loading of type {} has not been completed yet.", indexType);
            Thread.sleep(SLEEP);
        }
    }
}