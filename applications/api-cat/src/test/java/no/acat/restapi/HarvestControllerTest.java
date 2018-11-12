package no.acat.restapi;

import no.acat.harvester.HarvestQueue;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;
import java.lang.reflect.Method;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class HarvestControllerTest {


  @Spy @InjectMocks private HarvestController harvestController;

  HarvestQueue harvestQueue;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);
    harvestQueue = mock(HarvestQueue.class);

  }

  @Test
  public void add_one_task_to_harvest_quene() {
      harvestQueue.addTask("task1");
    verify(harvestQueue, times(1)).addTask("task1");
  }
    @Test
    public void add_two_task_to_harvest_quene() {
        doNothing().when(harvestQueue).addTask(isA(String.class));
        harvestQueue.addTask("task1");
        harvestQueue.addTask("task2");
        verify(harvestQueue, times(1)).addTask("task1");
        verify(harvestQueue, times(1)).addTask("task2");
    }

    @Test
    public void check_method_name_is_ok() {

        harvestController = new HarvestController(harvestQueue);

        doAnswer((Answer) invocation -> {
            Object method = invocation.getMethod();
            Assert.assertEquals("addTask", ((Method) method).getName());
            return "ok";
        }).when(harvestQueue).addTask(isA(String.class));

       harvestController.triggerHarvestAll();

    }
    @Test
    public void check_if_method_name_is_ok() {

        harvestController = new HarvestController(harvestQueue);

        doAnswer((Answer) invocation -> {
            Object method = invocation.getMethod();
            Assert.assertEquals("addTask", ((Method) method).getName());
            return "ok";
        }).when(harvestQueue).addTask(isA(String.class));

        harvestController.triggerHarvestApiRegistration("");

    }
}
