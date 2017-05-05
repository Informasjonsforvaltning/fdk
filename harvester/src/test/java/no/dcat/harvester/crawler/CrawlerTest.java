package no.dcat.harvester.crawler;

import no.dcat.admin.store.AdminDataStore;
import no.dcat.admin.store.DcatDataStore;
import no.dcat.admin.store.domain.DcatSource;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.FusekiResultHandler;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

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
		ElasticSearchResultHandler eHandler = new ElasticSearchResultHandler("",0, "elasticsearch");
		
		List<CrawlerJob> crawlerJobs = dcatSources.stream().map(dcatSource -> new CrawlerJob(dcatSource, adminDataStore, null, fHandler, eHandler)).collect(Collectors.<CrawlerJob>toList());
		
		Crawler crawler = new Crawler();
		crawler.initialize();
		
		List<Future<?>> futures = crawler.execute(crawlerJobs);
		
		for (Future<?> future :futures) { 
			future.get(); 
		}
	}

}
