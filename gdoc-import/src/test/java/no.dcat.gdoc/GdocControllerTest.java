package no.dcat.gdoc;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

/**
 * Created by dask on 22.12.2016.
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({GdocController.class,ProcessBuilder.class,Process.class})
public class GdocControllerTest {

    @MockBean
    GdocConfiguration config;

    @Before
    public void setup () {

    }

    @Test
    public void convertReturnsInternalSericeErrorTest() throws Exception {
        GdocController controller = new GdocController();
        ResponseEntity actual = controller.convert();

        assertEquals(actual.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /*
    @Test
    public void convertReturns() throws Exception {

        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor()).thenReturn(0);

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);

        PowerMockito.whenNew(ProcessBuilder.class).withAnyArguments().thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenReturn(mockProcess);
        when(mockProcessBuilder.directory(Matchers.anyObject())).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.redirectOutput()).thenReturn(null);

        GdocController controller = new GdocController();

        ReflectionTestUtils.setField(controller, "converterHomeDir", "usr/local/dcat");

        ResponseEntity actual = controller.convert();


    }

    */
}
