package no.fdk.harvestqueue;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@Category(UnitTest.class)
public class HarvestQueueTest {

    private HarvestQueue queue;

    @Test
    public void testEmptyQueAndPoll() throws Throwable {
        queue = new HarvestQueue();
        TestTask someTask = new TestTask();

        QueuedTask shouldBeNoTask = queue.poll();
        assertNull(shouldBeNoTask);

        queue.addTask(someTask);
        QueuedTask shouldBeATask = queue.poll();
        assertNotNull(shouldBeATask);
    }

    class TestTask implements QueuedTask {
        public String getDescription() {
            return "TestTask";
        }

        public void doIt() {
            //Do nothing-its a test
        }
    }

}
