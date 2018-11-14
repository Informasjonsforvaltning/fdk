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

  HarvestQueue harvestQueue;
  @Spy @InjectMocks private HarvestController harvestController;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);
    harvestQueue = mock(HarvestQueue.class);
  }

  @Test
  public void addOneTaskToHarvestQuene() {
    harvestQueue.addTask("task1");
    verify(harvestQueue, times(1)).addTask("task1");
  }

  @Test
  public void addTwoTaskToHarvestQuene() {
    doNothing().when(harvestQueue).addTask(isA(String.class));
    harvestQueue.addTask("task1");
    harvestQueue.addTask("task2");
    verify(harvestQueue, times(1)).addTask("task1");
    verify(harvestQueue, times(1)).addTask("task2");
  }

  @Test
  public void checkMethodNameIsOk() {

    harvestController = new HarvestController(harvestQueue);

    doAnswer(
            (Answer)
                invocation -> {
                  Object method = invocation.getMethod();
                  Assert.assertEquals("addTask", ((Method) method).getName());
                  return "ok";
                })
        .when(harvestQueue)
        .addTask(isA(String.class));

    harvestController.triggerHarvestAll();
  }

  @Test
  public void checkIfMethodNameIsOk() {

    harvestController = new HarvestController(harvestQueue);

    doAnswer(
            (Answer)
                invocation -> {
                  Object method = invocation.getMethod();
                  Assert.assertEquals("addTask", ((Method) method).getName());
                  return "ok";
                })
        .when(harvestQueue)
        .addTask(isA(String.class));

    harvestController.triggerHarvestApiRegistration("");
  }
}
