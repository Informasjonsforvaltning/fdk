package no.difi.dcat.harvester.crawler;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

import org.elasticsearch.client.Client;
import org.junit.Test;
import org.mockito.Mockito;

import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.harvester.crawler.handlers.FusekiResultHandler;

public class CrawlerTest {
	
	@Test
	public void testCrawlerThreadPool() throws Exception {
		
		DcatSource dcatSource1 = new DcatSource("http//dcat.difi.no/test1", "Test1", "src/test/resources/test-perfect.rdf", "tester", "123456789");
		DcatSource dcatSource2 = new DcatSource("http//dcat.difi.no/test2", "Test2", "src/test/resources/test-perfect.rdf", "tester", "");
		DcatSource dcatSource3 = new DcatSource("http//dcat.difi.no/test3", "Test3", "src/test/resources/test-perfect.rdf", "tester", null);
		DcatSource dcatSource4 = new DcatSource("http//dcat.difi.no/test4", "Test4", "src/test/resources/test-perfect.rdf", "tester", null);
		
		List<DcatSource> dcatSources = Arrays.asList(dcatSource1, dcatSource2, dcatSource3, dcatSource4);
		
		DcatDataStore dcatDataStore = Mockito.mock(DcatDataStore.class);
		AdminDataStore adminDataStore = Mockito.mock(AdminDataStore.class);

		FusekiResultHandler fHandler = new FusekiResultHandler(dcatDataStore, null);
		ElasticSearchResultHandler eHandler = new ElasticSearchResultHandler("",0);
		
		List<CrawlerJob> crawlerJobs = dcatSources.stream().map(dcatSource -> new CrawlerJob(dcatSource, adminDataStore, null, fHandler, eHandler)).collect(Collectors.<CrawlerJob>toList());
		
		Crawler crawler = new Crawler();
		crawler.initialize();
		
		List<Future<?>> futures = crawler.execute(crawlerJobs);
		
		for (Future<?> future :futures) { 
			future.get(); 
		}
	}

}
