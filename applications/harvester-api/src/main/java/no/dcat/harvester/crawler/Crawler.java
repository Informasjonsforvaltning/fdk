package no.dcat.harvester.crawler;

import no.dcat.harvester.settings.CrawlerSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

@Component
public class Crawler {
	
	@Autowired
	private CrawlerSettings crawlerSettings;


	private ThreadPoolExecutor executorService;
	
	private final Logger logger = LoggerFactory.getLogger(Crawler.class);
	
	public Crawler() {
	}
	
	@PostConstruct
	public void initialize() {
		if (crawlerSettings != null) {
			executorService = (ThreadPoolExecutor) Executors.newFixedThreadPool(crawlerSettings.getThreadPoolSize());
		} else {
			executorService = (ThreadPoolExecutor) Executors.newFixedThreadPool(2);
		}

	}

	public synchronized boolean isIdle(){
		return executorService.getQueue().isEmpty() && executorService.getActiveCount() == 0;
	}


	synchronized public Future<?> execute(CrawlerJob crawlerJob) {
		return executorService.submit(crawlerJob);
	}

}
