package no.acat.harvester;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

@Service
public class HarvestExecutor {
    public static final String HARVEST_ALL = "harvestAll";

    private static final Logger logger = LoggerFactory.getLogger(HarvestExecutor.class);
    private ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(1);
    private ApiHarvester apiHarvester;
    private HarvestQueue harvestQueue;

    public HarvestExecutor(ApiHarvester apiHarvester, HarvestQueue harvestQueue) {
        this.apiHarvester = apiHarvester;
        this.harvestQueue = harvestQueue;
    }

    @PostConstruct
    void harvestLoop() {
        executor.execute(() -> {

            while (true) {
                try {
                    Thread.sleep(1000L);

                    String task = harvestQueue.poll();

                    if (task != null) {
                        logger.debug("Running task {}", task);
                        switch (task) {
                            case HARVEST_ALL:
                                try {
                                    apiHarvester.harvestAll();
                                } catch (Exception e) {
                                    logger.warn("Problem with harvestAll: {}", e.getMessage());
                                }
                        }
                    }
                } catch (InterruptedException ie) {
                    logger.error("Harvest loop interrupted!");
                }
            }
        });

    }
}
