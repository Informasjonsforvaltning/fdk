package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultPubHandler;
import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.dcat.harvester.service.ReferenceDataSubjectService;
import no.dcat.harvester.service.SubjectCrawler;
import no.dcat.harvester.settings.ApplicationSettings;
import no.dcat.harvester.settings.FusekiSettings;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.net.URL;

@Component
public class CrawlerJobFactory {
	
	@Autowired
	private FusekiSettings fusekiSettings;

	@Autowired
	private ApplicationSettings applicationSettings;
	
	@Autowired
	private LoadingCache<URL, String> brregCache;

	@Autowired
	private SubjectCrawler subjectCrawler;
	
	private AdminDataStore adminDataStore;
	private DcatDataStore dcatDataStore;
	
	private FusekiResultHandler fusekiResultHandler;
	private ElasticSearchResultHandler elasticSearchResultHandler;
	private CrawlerResultHandler publisherHandler;
	private CrawlerResultHandler codeHandler;

	private final Logger logger = LoggerFactory.getLogger(CrawlerJobFactory.class);

	@PostConstruct
	public void initialize() {
		adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
		dcatDataStore = new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri()));
		fusekiResultHandler = new FusekiResultHandler(dcatDataStore, adminDataStore);
	}
	
	public CrawlerJob createCrawlerJob(DcatSource dcatSource) {

		logger.debug("application.elasticSearchHost: " + applicationSettings.getElasticSearchHost());
		logger.debug("application.elasticSearchPort: " + applicationSettings.getElasticSearchPort());
		logger.debug("application.elasticSearchCluster: " + applicationSettings.getElasticSearchCluster());
		logger.debug("application.themesHostname: " + applicationSettings.getThemesHostname());
		logger.debug("application.httpUsername: " + applicationSettings.getHttpUsername());
		logger.debug("application.httpPassword: " + applicationSettings.getHttpPassword());

		publisherHandler = new ElasticSearchResultPubHandler(applicationSettings.getElasticSearchHost(),applicationSettings.getElasticSearchPort(), applicationSettings.getElasticSearchCluster());
		elasticSearchResultHandler = new ElasticSearchResultHandler(applicationSettings.getElasticSearchHost(), applicationSettings.getElasticSearchPort(), applicationSettings.getElasticSearchCluster(), applicationSettings.getThemesHostname(), applicationSettings.getHttpUsername(), applicationSettings.getHttpPassword());

		return new CrawlerJob(dcatSource, adminDataStore, brregCache, subjectCrawler, fusekiResultHandler, elasticSearchResultHandler, publisherHandler);
	}

}
