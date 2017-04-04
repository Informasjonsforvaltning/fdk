package no.dcat.gdoc;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.runners.MockitoJUnitRunner;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.agent.PowerMockAgent;
import org.powermock.modules.junit4.rule.PowerMockRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

/**
 * Created by dask on 22.12.2016.
 */
@RunWith(MockitoJUnitRunner.class) //(PowerMockRunner.class)
@PrepareForTest({GdocController.class})
public class GdocControllerTest {
    private static Logger logger = LoggerFactory.getLogger(GdocControllerTest.class);

    @Rule
    public PowerMockRule rule = new PowerMockRule();

    static {
       PowerMockAgent.initializeIfNeeded();
    }

    private GdocController gdocController;

    @Before
    public void setup () {

        gdocController = new GdocController();
        ReflectionTestUtils.setField(gdocController, "converterHomeDir", "/app/dcat");
        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/app/dcat/publish");
    }

    /**
     * Attemts to call to convert without proper environment. Needs directory, bash, tranformation, and
     * validation files.
     *
     * @throws Exception
     */
    @Test
    public void convertReturnsInternalSericeError() throws Exception {

        ResponseEntity actual = gdocController.convert();

        assertEquals(actual.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    /**
     * Here we mock the call to process builder and process.
     *
     * @throws Exception
     */
    @Test
    public void runConvertReturnsOK() throws Exception {

        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor()).thenReturn(0);

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);
        PowerMockito.whenNew(ProcessBuilder.class).withArguments(anyString(), anyString()).thenReturn(mockProcessBuilder);

        when(mockProcessBuilder.directory(Matchers.anyObject())).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenReturn(mockProcess);

        when(mockProcessBuilder.redirectOutput()).thenReturn(null);
        when(mockProcessBuilder.redirectError()).thenReturn(null);

        FileOutputStream mockOutputStream = mock(FileOutputStream.class);
        PowerMockito.whenNew(FileOutputStream.class).withAnyArguments().thenReturn(mockOutputStream);

        OutputStreamWriter mockWriter = mock(OutputStreamWriter.class);
        PowerMockito.whenNew(OutputStreamWriter.class).withAnyArguments().thenReturn(mockWriter);
        when(mockWriter.append(anyString())).thenReturn(mockWriter);

        BufferedReader mockBufferedReader = mock(BufferedReader.class);
        PowerMockito.whenNew(BufferedReader.class).withAnyArguments().thenReturn(mockBufferedReader);
        when(mockBufferedReader.readLine()).thenReturn("line").thenReturn("DEBUG org.vedantatree.this.is.a.test").thenReturn(null);

        String actual = gdocController.runConvert();

        PowerMockito.verifyNew(ProcessBuilder.class);

        logger.info(actual);
        assertNotNull(actual);

    }

    /**
     * Here we mock test when runConvert fails
     *
     * @throws Exception
     */
    @Test
    public void runConvertReturnsException() throws Exception {

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);
        PowerMockito.whenNew(ProcessBuilder.class).withArguments(anyString(), anyString()).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenThrow(new IOException());

        try {
            String actual = gdocController.runConvert();
        } catch (IOException e) {
            assertTrue(true);
            return;
        }

        assertFalse(true);

    }

    @Test
    public void converReturnsThrows() throws Exception {
        gdocController.convert();

    }

    @Test
    public void convertReturnsOK() throws Exception {
        String logfileName = "conversion-2017-03-44.log";

        GdocController gdocSpy = spy(gdocController);
        doReturn(logfileName).when(gdocSpy).runConvert();

        ResponseEntity<String> actual = gdocSpy.convert();

        assertNotNull(actual);
        assertEquals("convert shall return true", HttpStatus.OK, actual.getStatusCode());
        assertTrue("convert shall return text that contains logfilename",actual.toString().contains(logfileName));
    }

    /**
     * Mocks filesystem and returns list call.
     *
     * @throws Exception
     */
    @Test
    public void listReturnsOK () throws Exception {

        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor()).thenReturn(0);

        ProcessBuilder mockProcessBuilder = PowerMockito.mock(ProcessBuilder.class);
        PowerMockito.whenNew(ProcessBuilder.class).withArguments(anyString()).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.directory(Matchers.anyObject())).thenReturn(mockProcessBuilder);
        when(mockProcessBuilder.start()).thenReturn(mockProcess);

        BufferedReader mockBufferedReader = mock(BufferedReader.class);
        PowerMockito.whenNew(BufferedReader.class).withAnyArguments().thenReturn(mockBufferedReader);
        when(mockBufferedReader.readLine()).thenReturn("line").thenReturn(null);

        ResponseEntity actual = gdocController.list();

        assertEquals(HttpStatus.OK, actual.getStatusCode());
    }

    @Test
    public void getFileContentThrowsIOException() {
        GdocController controller = new GdocController();

        Files filesMock = PowerMockito.mock(Files.class);
        File mockFile = mock(File.class);

        try {
            doThrow(new IOException("io")).when(filesMock).lines(anyObject());
            controller.getFileContent(mockFile);
        } catch (Exception e) {
            assertTrue(true);
        }
    }
    @Test
    public void getFileContentThrowsIllegalPath() {
        GdocController controller = new GdocController();

        File f = new File("htp:/www.gogole.ttl");

        File mockFile = mock(File.class);
        doThrow(new InvalidPathException("en", "to")).when(mockFile).toPath();

        try {
            controller.getFileContent(mockFile);
        } catch (InvalidPathException ip) {
            assertTrue(true);
        }
    }


    /**
     * Whitout mocked filesystem list will fail.
     *
     * @throws Exception
     */
    @Test
    public void listFailsAsExpected() throws Exception {
        ResponseEntity actual = gdocController.list();

        assertNotEquals(HttpStatus.OK, actual.getStatusCode());
    }

    /**
     * Calls versions/null. As expected this gdoc file is not found.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithoutArgumentsReturnsNotFound() throws Exception {
        File mockFile = mock(File.class);
        when(mockFile.listFiles()).thenReturn(null);

        ResponseEntity<String> actual = gdocController.versions(null);

        assertEquals(HttpStatus.NOT_FOUND, actual.getStatusCode() );
    }

    /**
     * Tries GET /versions/2016-12-24. Mocks three files. File wich contains 2016-12-24 is returned.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithVersionIdArgumentReturnsFileOK() throws Exception {

        File f1 = File.createTempFile("anyname2016-11-24","ttl");
        File f2 = File.createTempFile("anyname2016-12-24","ttl");
        File f3 = File.createTempFile("anyname2017-01-24","ttl");

        File[] dir = new File[3];
        dir[0] = f1;
        dir[1] = f2;
        dir[2] = f3;

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

    /**
     * Tries: GET versions/2016-UNKNOWN. The versionId is not in any of the two provided files,
     * so it returnes not found.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithUnknownVersionIdReturnsNotFound() throws Exception {

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


        ResponseEntity<String> actual = gdocController.versions("2016-UNKNOWN");

        assertEquals(HttpStatus.NOT_FOUND, actual.getStatusCode() );
    }

    /**
     * Tries: GET /versions/2016-11-24. But an exception is thrown when BufferedReader is created. Therefore
     * the service returns internal server error.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithKnownVersionIdFailsReadingFileAndReturnsInternalServerError() throws Exception {

        File f1 = File.createTempFile("anyname2016-11-24","ttl");
        File f2 = File.createTempFile("anyname2016-12-24","ttl");
        File[] dir = new File[2];
        dir[0] = f1;
        dir[1] = f2;

        ResponseEntity<String> response =  new ResponseEntity<>("test",HttpStatus.INTERNAL_SERVER_ERROR);
        File mockFile = mock(File.class);
        File mockDir = mock(File.class);

        GdocController spyController = spy(gdocController);
        doReturn(mockDir).when(spyController).getFile(anyString(), anyObject());
        doReturn(response).when(spyController).getFileContent(anyObject());

        ReflectionTestUtils.setField(gdocController, "converterResultDir", "/usr/local/dcat/publish");
        ResponseEntity<String> actual = spyController.versions("2016-11-24");
        logger.debug(actual.toString());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, actual.getStatusCode() );
    }


    /**
     * Tries: GET versions/latest. But the file stored in the publish directory has illegal path-name and can
     * therefore not be found when reading the file. Returns internal server error.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithKnownVersionIdFailsIncorrectFileNameInternalServerError() throws Exception {

        File f2 = new File("htp:/www.gogole.ttl");
        File[] dir = new File[1];

        dir[0] = f2;
        URI uri = new URI("htp:/www.google.ttl");

      //  when(f2.toURI()).thenReturn(uri);
      //  when(f2.lastModified()).thenReturn(0L);

        File mockFile = mock(File.class);
        PowerMockito.whenNew(File.class).withArguments("/app/dcat/publish").thenReturn(mockFile);
        when(mockFile.listFiles()).thenReturn(dir);

        ResponseEntity<String> actual = gdocController.versions("latest");
        logger.debug(actual.toString());

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, actual.getStatusCode() );
    }

    /**
     * Tries: GET /versions/latest. Two files exists. The latest file is returned.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithLatestArgumentReturnsFileOK() throws Exception {
        File[] dir = new File[2];
        dir[0] = File.createTempFile("anyname2016-11-22", ".ttl");
        Thread.sleep(1000);
        dir[1] = File.createTempFile("anyname2016-12-24", ".ttl");
        PrintWriter writer = new PrintWriter(dir[1]);
        writer.println("This is the latest file");
        writer.close();

        File mockFile = mock(File.class);
        PowerMockito.whenNew(File.class).withAnyArguments().thenReturn(mockFile);
        when(mockFile.listFiles()).thenReturn(dir);

        ResponseEntity<String> actual = gdocController.versions("latest");

        assertEquals(HttpStatus.OK, actual.getStatusCode() );
        assertTrue(actual.toString().contains("latest"));
    }

    /**
     * Tries: GET /versions/latest. Two files is located, but are in reverse order with respect to their modification
     * date. Makes sure the latest is returned.
     *
     * @throws Exception
     */
    @Test
    public void versionsWithLatestArgumentReturnsLastModifiedFileOK() throws Exception {
        File[] dir = new File[2];

        dir[1] = File.createTempFile("anyname2016-12-24", ".ttl");
        Thread.sleep(1000);

        dir[0] = File.createTempFile("anyname2016-11-22", ".ttl");
        PrintWriter writer = new PrintWriter(dir[0]);
        writer.println("This is the 2016-11-22 file");
        writer.close();

        File mockFile = mock(File.class);
        PowerMockito.whenNew(File.class).withAnyArguments().thenReturn(mockFile);
        when(mockFile.listFiles()).thenReturn(dir);

        ResponseEntity<String> actual = gdocController.versions("latest");

        logger.debug(actual.toString());

        assertEquals(HttpStatus.OK, actual.getStatusCode() );

        assertTrue(actual.toString().contains("2016-11-22"));
    }

}
