package no.fdk.harvestqueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

@Service
public class HarvestExecutor {

    private static final Logger logger = LoggerFactory.getLogger(HarvestExecutor.class);
    private ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(1);

    private HarvestQueue harvestQueue;

    public HarvestExecutor(HarvestQueue harvestQueue) {
        this.harvestQueue = harvestQueue;
    }


    void someLoop() {
        executor.execute(() -> {
        });
    }

    @PostConstruct
    void harvestLoop() {

        executor.execute(() -> {

                while (true) {
                    singleLoopStep();
                }
            }
        );
    }

    private void singleLoopStep() {
        try {
            Thread.sleep(1000L);

            QueuedTask task = harvestQueue.poll();

            if (task != null) {
                logger.debug("Running task {}", task.getDescription());
                try {
                    task.doIt();
                } catch (Exception e) {
                    logger.warn("Problem with task: {}", e.getMessage());
                }
            }
        } catch (InterruptedException ie) {
            logger.error("Harvest loop interrupted!");
        }
    }

}
