package no.acat.harvester;


import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@Category(UnitTest.class)
public class HarvestQueueTest {
    private static final Logger logger = LoggerFactory.getLogger(HarvestExecutor.class);

    private HarvestQueue queue;
    private ApiHarvester harvester;
    private HarvestExecutor executor;

    @Before
    public void setup() {
        queue = new HarvestQueue();
        harvester = mock(ApiHarvester.class);
        doNothing().when(harvester).harvestAll();

        executor = new HarvestExecutor(harvester, queue);
        executor.harvestLoop();
    }

    @Test
    public void testExecutionLogic() throws Throwable {

        String ht = HarvestExecutor.HARVEST_ALL;

        queue.addTask(ht);

        queue.addTask(ht); // should be blocked by queue since it already has the same task registered

        Thread.sleep(1002);

        verify(harvester, times(1)).harvestAll();

        queue.addTask(ht);

        Thread.sleep(1002);

        verify(harvester, times(2)).harvestAll();

        String tsk = queue.poll();

        assertEquals("queue should have no elements", tsk, null);

    }

    @Test
    public void harvestAllFails() throws Throwable {
        doThrow(new NullPointerException("Throws error")).when(harvester).harvestAll();

        queue.addTask(HarvestExecutor.HARVEST_ALL);

        Thread.sleep(1002);

        assertEquals("queue should be empty", queue.poll(), null);

    }


}
