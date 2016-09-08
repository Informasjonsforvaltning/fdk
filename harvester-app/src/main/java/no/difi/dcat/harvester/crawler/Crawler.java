package no.difi.dcat.harvester.crawler;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import no.difi.dcat.harvester.settings.ApplicationSettings;

@Component
public class Crawler {
	
	@Autowired
	private ApplicationSettings applicationSettings;
	
	private ExecutorService executorService;
	
	private final Logger logger = LoggerFactory.getLogger(Crawler.class);
	
	public Crawler() {
	}
	
	@PostConstruct
	public void initialize() {
		if (applicationSettings != null) {
			executorService = Executors.newFixedThreadPool(applicationSettings.getCrawlerThreadPoolSize());
		} else {
			executorService = Executors.newFixedThreadPool(2);
		}
	}
	
	public Future<?> execute(CrawlerJob crawlerJob) {
		return executorService.submit(crawlerJob);
	}
	
	public List<Future<?>> execute(List<CrawlerJob> crawlerJobs) {
		List<Future<?>> futures = new ArrayList<>();
		for (CrawlerJob crawlerJob : crawlerJobs) {
			futures.add(execute(crawlerJob));
		}
		return futures;
	}
}
