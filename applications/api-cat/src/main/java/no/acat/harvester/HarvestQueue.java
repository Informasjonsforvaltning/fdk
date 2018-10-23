package no.acat.harvester;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.LinkedList;

@Service
public class HarvestQueue {
    private static final Logger logger = LoggerFactory.getLogger(HarvestQueue.class);

    private final LinkedList<String> scheduledTasks = new LinkedList<>();

    public void addTask(String task) {
        synchronized (scheduledTasks) {
            if (scheduledTasks.contains(task)) {
                logger.debug("Task already exists in queue: {}", task);
                return;
            }
            scheduledTasks.add(task);
            logger.debug("Task added to queue: {}", task);
        }
    }

    public String poll() {
        synchronized (scheduledTasks) {
            return scheduledTasks.poll();
        }
    }
}
