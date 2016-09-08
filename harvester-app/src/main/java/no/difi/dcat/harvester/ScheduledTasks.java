package no.difi.dcat.harvester;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.difi.dcat.harvester.settings.FusekiSettings;

@Component
public class ScheduledTasks {
	
	@Autowired
	private FusekiSettings fusekiSettings;
	
	private AdminDataStore adminDataStore;
	private FusekiResultHandler crawlerResultHandler;
	
	private final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
	
	@PostConstruct
	public void initialize() {
		adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
		crawlerResultHandler = new FusekiResultHandler(fusekiSettings.getDcatServiceUri(), fusekiSettings.getAdminServiceUri());
	}
	
//	@Scheduled(cron = "0 0 */1 * * *") //run hourly
//	public void runCrawlerJobs() {
//		logger.debug("Starting scheduled crawler jobs");
//		List<DcatSource> dcatSources = adminDataStore.getDcatSources();
//		for (DcatSource dcatSource : dcatSources) {
//			CrawlerJob job = new CrawlerJob(crawlerResultHandler, dcatSource, adminDataStore);
//			job.run();
//			int dcatIndex = dcatSources.indexOf(dcatSource) + 1;
//			logger.debug("Finished crawler job for {}. Jobs remaining: {} of {}", dcatSource.getId(), dcatIndex, dcatSources.size());
//		}
//		logger.debug("Scheduled crawler jobs completed.");
//	}
}
