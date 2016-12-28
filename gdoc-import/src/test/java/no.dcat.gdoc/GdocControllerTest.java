package no.dcat.gdoc;

import org.apache.tomcat.jni.Proc;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

/**
 * Created by dask on 22.12.2016.
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({GdocController.class,ProcessBuilder.class,Process.class})
public class GdocControllerTest {

    private GdocController gdocController;

    @Before
    public void setup () {
        gdocController = new GdocController();
    }

    @Test
    public void convertReturnsInternalSericeErrorTest() throws Exception {

        ResponseEntity actual = gdocController.convert();

        assertEquals(actual.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Test
    public void convertReturnsOK() throws Exception {

        Process mockProcess = PowerMockito.mock(Process.class);
        when(mockProcess.waitFor()).thenReturn(0);

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);

        PowerMockito.whenNew(ProcessBuilder.class).withArguments(anyString(), anyString()).thenReturn(mockProcessBuilder);

        when(mockProcessBuilder.directory(Matchers.anyObject())).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenReturn(mockProcess);

        when(mockProcessBuilder.redirectOutput()).thenReturn(null);
        when(mockProcessBuilder.redirectError()).thenReturn(null);

        ReflectionTestUtils.setField(gdocController, "converterHomeDir", "/usr/local/dcat");
        ResponseEntity actual = gdocController.convert();

        PowerMockito.verifyNew(ProcessBuilder.class);

        assertEquals(HttpStatus.OK, actual.getStatusCode());

    }

    @Test
    public void listReturnsOK () throws Exception {

        Process mockProcess = PowerMockito.mock(Process.class);
        when(mockProcess.waitFor()).thenReturn(0);

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);
        PowerMockito.whenNew(ProcessBuilder.class).withArguments(anyString()).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.directory(Matchers.anyObject())).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenReturn(mockProcess);

        BufferedReader mockBufferedReader = mock(BufferedReader.class);
        PowerMockito.whenNew(BufferedReader.class).withAnyArguments().thenReturn(mockBufferedReader);
        when(mockBufferedReader.readLine()).thenReturn("line").thenReturn(null);

        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/usr/local/dcat/publish");
        ResponseEntity actual = gdocController.list();

        assertEquals(HttpStatus.OK, actual.getStatusCode());

    }

    @Test
    public void versionsWithoutArgumentsReturnsNotFound() throws Exception {
        File mockFile = mock(File.class);
        when(mockFile.listFiles()).thenReturn(null);

        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/usr/local/dcat/publish");
        ResponseEntity<String> actual = gdocController.versions(null);

        assertEquals(HttpStatus.NOT_FOUND, actual.getStatusCode() );
    }

    @Test
    public void versionsWithArgumentReturnsFileOK() throws Exception {

        File f1 = File.createTempFile("anyname2016-11-24","ttl");
        File f2 = File.createTempFile("anyname2016-12-24","ttl");
        File[] dir = new File[2];
        dir[0] = f1;
        dir[1] = f2;

        File mockFile = mock(File.class);
        PowerMockito.whenNew(File.class).withAnyArguments().thenReturn(mockFile);
        when(mockFile.listFiles()).thenReturn(dir);

        BufferedReader mockBufferedReader = mock(BufferedReader.class);
        PowerMockito.whenNew(BufferedReader.class).withAnyArguments().thenReturn(mockBufferedReader);
        when(mockBufferedReader.readLine()).thenReturn("line").thenReturn(null);

        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/usr/local/dcat/publish");
        ResponseEntity<String> actual = gdocController.versions("2016-12-24");

        assertEquals(HttpStatus.OK, actual.getStatusCode() );
    }

    @Test
    public void versionsWithLatestArgumentReturnsFileOK() throws Exception {
        File[] dir = new File[2];
        dir[0] = File.createTempFile("anyname2016-11-22", "ttl");
        Thread.sleep(100);
        dir[1] = File.createTempFile("anyname2016-12-24", "ttl");
        PrintWriter writer = new PrintWriter(dir[1]);
        writer.println("This is the latest file");
        writer.close();

        File mockFile = mock(File.class);
        PowerMockito.whenNew(File.class).withAnyArguments().thenReturn(mockFile);
        when(mockFile.listFiles()).thenReturn(dir);

        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/usr/local/dcat/publish");
        ResponseEntity<String> actual = gdocController.versions("latest");

        assertEquals(HttpStatus.OK, actual.getStatusCode() );
        assertTrue(actual.toString().contains("latest"));
    }
}
