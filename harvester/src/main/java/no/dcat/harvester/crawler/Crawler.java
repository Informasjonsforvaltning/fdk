package no.dcat.harvester.crawler;

import no.dcat.harvester.settings.ApplicationSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sun.nio.ch.ThreadPool;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

@Component
public class Crawler {
	
	@Autowired
	private ApplicationSettings applicationSettings;


	private ThreadPoolExecutor executorService;
	
	private final Logger logger = LoggerFactory.getLogger(Crawler.class);
	
	public Crawler() {
	}
	
	@PostConstruct
	public void initialize() {
		if (applicationSettings != null) {
			executorService = (ThreadPoolExecutor) Executors.newFixedThreadPool(applicationSettings.getCrawlerThreadPoolSize());
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

	synchronized public Future<?> execute(CrawlerCodeJob crawlerCodeJob) {
		return executorService.submit(crawlerCodeJob);
	}

	synchronized public List<Future<?>> execute(List<CrawlerJob> crawlerJobs) {
		List<Future<?>> futures = new ArrayList<>();
		for (CrawlerJob crawlerJob : crawlerJobs) {
			futures.add(execute(crawlerJob));
		}
		return futures;
	}
}
