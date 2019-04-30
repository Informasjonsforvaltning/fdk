package no.dcat.harvester.crawler.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Created by dask on 28.02.2017.
 */
@Component
@Profile({"docker", "prod", "develop"})
public class CrawlerStartHarvest implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(CrawlerStartHarvest.class);

    @Autowired
    private ApplicationContext context;


    public CrawlerRestController getController() {
        return context.getBean(CrawlerRestController.class);
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {

        try {
            logger.debug("Startup code get application context");

            CrawlerRestController crawler = getController();

            if (crawler != null) {
                logger.info("Run harvest all at application startup");
                crawler.harvestAllDcatSources();
            }

        } catch (Exception e) {
            logger.debug("Error starting harvest all at startup", e);
        }

    }
}

