package no.fdk.harvestqueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.Queue;

@Service
public class HarvestQueue {
    private static final Logger logger = LoggerFactory.getLogger(HarvestQueue.class);

    private final Queue<QueuedTask> scheduledTasks = new LinkedList<QueuedTask>();

    public void addTask(QueuedTask task) {
        synchronized (scheduledTasks) {
            if (scheduledTasks.contains(task)) {
                logger.debug("Task already exists in queue: {}", task);
                return;
            }
            scheduledTasks.add(task);
            logger.debug("Task added to queue: {}", task);
        }
    }

    public QueuedTask poll() {
        synchronized (scheduledTasks) {
            return scheduledTasks.poll();
        }
    }
}
