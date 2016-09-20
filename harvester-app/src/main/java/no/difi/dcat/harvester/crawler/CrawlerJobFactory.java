package no.difi.dcat.harvester.crawler;

import java.net.URL;

import javax.annotation.PostConstruct;

import no.difi.dcat.harvester.settings.ApplicationSettings;
import org.elasticsearch.client.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.cache.LoadingCache;

import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Fuseki;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.harvester.crawler.handlers.FusekiResultHandler;
import no.difi.dcat.harvester.settings.FusekiSettings;

@Component
public class CrawlerJobFactory {
	
	@Autowired
	private FusekiSettings fusekiSettings;

	@Autowired
	private ApplicationSettings applicationSettings;
	
	@Autowired
	private LoadingCache<URL, String> brregCache;
	
	private AdminDataStore adminDataStore;
	private DcatDataStore dcatDataStore;
	
	private FusekiResultHandler fusekiResultHandler;
	private ElasticSearchResultHandler elasticSearchResultHandler;

	@PostConstruct
	public void initialize() {
		adminDataStore = new AdminDataStore(new Fuseki(fusekiSettings.getAdminServiceUri()));
		dcatDataStore = new DcatDataStore(new Fuseki(fusekiSettings.getDcatServiceUri()));
		fusekiResultHandler = new FusekiResultHandler(dcatDataStore, adminDataStore);
		
	}
	
	public CrawlerJob createCrawlerJob(DcatSource dcatSource) {
		elasticSearchResultHandler = new ElasticSearchResultHandler(applicationSettings.getElasticSearchHost(), applicationSettings.getElasticSearchPort());
		return new CrawlerJob(dcatSource, adminDataStore, brregCache, fusekiResultHandler, elasticSearchResultHandler);
	}



}
