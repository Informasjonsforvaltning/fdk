package no.dcat.harvester.crawler.web;

import no.dcat.harvester.crawler.Crawler;
import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.CrawlerJobFactory;
import no.dcat.harvester.settings.FusekiSettings;
import no.dcat.datastore.AdminDataStore;
import no.dcat.datastore.Fuseki;
import no.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.xml.bind.DatatypeConverter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@EnableScheduling
public class CrawlerRestController {

    /* Start harvesting at 1 o'clock every day */
    final static String scheduleSpesification = "0 0 1 * * *";

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


    /**
     * Load DCAT data file into fuseki and elastic (to be used for testing)
     *
     * @param filename Name of file to be loaded. Must be Turlte, json-ld or RFD/XML format
     * @param base64 Base64 encoded DCAT data
     * @return HTTP 200 OK if data was successfully loaded, HTTP 400 Bad request if loading did not succeed
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST, value = "/api/admin/load")
    public ResponseEntity<String> load(@RequestParam(value = "filename") String filename,
                                       @RequestParam(value = "data") String base64) {
        try {
            logger.info("Harvest load request: " +filename + " " + base64.length() );

            byte[] txt = DatatypeConverter.parseBase64Binary(base64.split(",")[1]);

            File tempDir = new File(System.getProperty("java.io.tmpdir"));

            String prefix = filename.substring(0,filename.indexOf('.'));
            String postfix = filename.substring(filename.indexOf('.'),filename.length());
            File tempFile = File.createTempFile(prefix, postfix, tempDir);
            FileOutputStream fos = null;
            try {
                fos = new FileOutputStream(tempFile);
                fos.write(txt);
            } finally {
                if (fos != null) {
                    fos.close();
                }
            }
            logger.debug(tempFile.getAbsolutePath());

            String url = tempFile.toURI().toURL().toString();
            logger.debug ("reading tempfile " + url);

            DcatSource dsource = new DcatSource();
            dsource.setId(filename);
            dsource.setDescription("Manual load of file");
            dsource.setUrl(url);
            dsource.setGraph("http://dcat.no/filename_" + filename);

            List<String> resultMsgs = null;
            try {

                resultMsgs = doCrawl(dsource);

            } catch (InterruptedException e) {
                logger.error("Interrupted: {}",e.getMessage());
                Thread.currentThread().interrupt();
            }

            if (resultMsgs != null) {
                // Format results
                StringBuilder msg = new StringBuilder();
                boolean success = true;
                for (String s : resultMsgs) {
                    if (s.contains("validation_error")) success = false;
                    int index = s.indexOf(", crawler_id");
                    String sub;
                    if (index != -1) sub = s.substring(0, index);
                    else sub = s;

                    msg.append(sub + "\n");
                }

                String finalMessage = msg.toString();
                logger.debug(finalMessage);

                if (success) {
                    logger.info("Load File Success");
                    //String message = "{\"success\": \"" + filename + " successfully loaded!\"}";
                    return new ResponseEntity<String>(finalMessage, HttpStatus.OK);
                } else {
                    logger.info("Unsucsesfull in loading");
                    return new ResponseEntity<String>(finalMessage, HttpStatus.BAD_REQUEST);
                }
            }

        } catch (IOException e) {
            logger.error("Unable to load file due to {}",e.getMessage(),e);
        }

        return new ResponseEntity<String>("Unable to load file " + filename, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    List<String> doCrawl(DcatSource dsource) throws InterruptedException {
        List<String> resultMsgs;

        CrawlerJob job = crawlerJobFactory.createCrawlerJob(dsource);

        Thread crawlerThread = new Thread(job);
        crawlerThread.start();

        // wait for the job to finish
        crawlerThread.join();

        resultMsgs = job.getValidationResult();
        return resultMsgs;
    }


    @RequestMapping("/api/admin/harvest")
    public void harvestDataSoure(@RequestParam(value = "id") String dcatSourceId) throws InterruptedException {
        logger.info("Received request to harvest {}", dcatSourceId);

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
        logger.info("Received request to harvest all dcat sources");

        harvestAllDcatSources();
        logger.debug("Finished all crawler jobs");
    }

    /**
     * Gets all datasources from admin database and starts an execution jobb to harvest the data
     * This job starts at 01:00 every day. Test string "0 *\/1 * * * *" - Every minute
     */
    @Scheduled(cron = scheduleSpesification)
    void harvestAllDcatSources() throws InterruptedException {
        logger.info("HARVEST ALL - " + Calendar.getInstance().getTime().toString());

        logger.debug("Start Crawler Job for each dcat source");

        for (DcatSource dcatSource : adminDataStore.getDcatSources()) {
            logger.info("STARTING CRAWLERJOB {}", dcatSource.getUrl());

            CrawlerJob job = crawlerJobFactory.createCrawlerJob(dcatSource);
            try {
                crawler.execute(job).get();
            } catch (Exception e) {
                logger.error("EXECUTION ERROR ", e);
            }
        }
    }

    List<DcatSource> getDcatSources() {
        return adminDataStore.getDcatSources();
    }





    @CrossOrigin
    @RequestMapping(method = RequestMethod.GET, value = "/api/admin/isIdle", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Object> isIdle() {
        Map<String, Boolean>  ret = new HashMap<>();
        ret.put("idle", crawler.isIdle());
        return ResponseEntity.ok(ret);

    }
}