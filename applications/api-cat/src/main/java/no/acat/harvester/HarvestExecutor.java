package no.acat.harvester;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import static no.acat.harvester.HarvestTask.HARVEST_ALL;

@Service
public class HarvestExecutor {
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
        executor.submit(() -> {
            while (true) {
                Thread.sleep(1000L);
                HarvestTask task;
                do {
                    task = harvestQueue.poll();
                    if (task != null) {
                        logger.debug("Running task {}", task);
                        switch (task.getMethod()) {
                            case HARVEST_ALL:
                                apiHarvester.harvestAll();
                        }
                    }
                } while (task != null);
            }
        });

    }
}
