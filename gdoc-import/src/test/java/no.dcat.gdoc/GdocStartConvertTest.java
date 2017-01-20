package no.dcat.gdoc;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;

import static org.mockito.Mockito.*;

/**
 * Created by dask on 20.01.2017.
 */
public class GdocStartConvertTest {

    @Autowired
    private ApplicationContext context;

    @Test
    public void testConverterOK() throws Exception {
        GdocStartConvert gstart = new GdocStartConvert();
        GdocController controllerMock = mock(GdocController.class);
        when(controllerMock.runConvert()).thenReturn("OK");

        GdocStartConvert gstartSpy = spy(gstart);
        doReturn(controllerMock).when(gstartSpy).getController();


        gstartSpy.onApplicationEvent(mock(ApplicationReadyEvent.class));

    }
}
