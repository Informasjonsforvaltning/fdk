package no.dcat.gdoc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.stream.Stream;

/**
 * Main REST controller for GDOC-Import Service.
 * <p>
 * <p>Created by dask on 19.12.2016.
 */
@Controller
public class GdocController {

    public static final String STARTED = "Startet ";
    private static Logger logger = LoggerFactory.getLogger(GdocController.class);

    private static final String GET_A_VERSION = "versions/{versionId}";
    private static final String LIST_VERSIONS = "versions";
    private static final String CONVERT_GDOC = "convert";
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD HH:mm");

    @Value("${application.converterHomeDir:/home/1000/dcat/}")
    private String converterHomeDir;

    @Value("${application.converterResultDir:/home/1000/dcat/publish}")
    private String converterResultDir;


    public void setConverterHomeDir(final String converterHomeDir) {

        this.converterHomeDir = converterHomeDir;
    }

    public void setConverterResultDir(final String converterResultDir) {

        this.converterResultDir = converterResultDir;
    }

    /**
     * Runs the convert operation every hour.
     */
    @Scheduled(cron = "0 0 * * * *")
    String runConvert() throws IOException, InterruptedException {

        String date = dateFormat.format(new Date());
        logger.debug("Start conversion {}", date);

        Process process;

        ProcessBuilder pb = new ProcessBuilder("bash", "dcat.sh");
        pb.directory(new File(converterHomeDir));
        File tempLogfileName = File.createTempFile("convert", "log");
        pb.redirectOutput(tempLogfileName);
        pb.redirectError(tempLogfileName);

        process = pb.start();

        int retValue = process.waitFor();

        logger.debug("bash dcat.sh returned {}",retValue);

        String logfileName = "conversion-" + date + ".log";
        String logfilePath = converterResultDir + "/" + logfileName;
        logger.debug(logfilePath);

        // process data, filter messages

        OutputStreamWriter writer = null;
        BufferedReader logReader = null;
        try {
            writer = new OutputStreamWriter(
                    new FileOutputStream(logfilePath), StandardCharsets.UTF_8);

            logReader = new BufferedReader(
                    new InputStreamReader(new FileInputStream(tempLogfileName), StandardCharsets.UTF_8));

            String line;
            while ((line = logReader.readLine()) != null) {
                // remove the bloody debug messages.
                // I didn't succed in adding log4j file to the semtex call
                if (!line.contains("DEBUG org.vedantatree.")) {
                    writer.append(line);
                    writer.append(System.lineSeparator());
                }
            }
        } finally {
            if (writer != null) {
                writer.close();
            }

            if (logReader != null) {
                logReader.close();
            }
        }

        logger.debug("finished conversion {}", logfileName);

        return logfileName;
    }


    /**
     * Gets the google sheet document from google and converts it to turtle format.
     * The resulting file is stored with the current date in its filename. If convert is
     * run more than once onthe same day the previous file for that day is overwritten.
     *
     * <p>The resulting turtle file can be accessed by the /versions service.
     *
     * @return the output log of the conversion run
     */
    @CrossOrigin
    @RequestMapping(value = {CONVERT_GDOC}, method = {RequestMethod.GET, RequestMethod.POST},
            produces = "text/plain;charset=UTF-8")
    public final ResponseEntity<String> convert() {
        final long start = System.currentTimeMillis();
        ResponseEntity<String> result;

        logger.info(STARTED + CONVERT_GDOC);

        try {
            String resultLogfileName = runConvert();

            result = new ResponseEntity<>("Conversion executed, see logfile for more info: " + resultLogfileName,
                    HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Conversion failed {}",e.getMessage(),e);
            result = new ResponseEntity<>("Conversion error: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        logger.info(CONVERT_GDOC + " used " + (System.currentTimeMillis() - start));

        return result;

    }

    /**
     * Fetches a spesific version of the gdoc converted turtle file. A file will typically have
     * the generation date in the file name. This date (YYYY-MM-DD) is used as versionId.
     *
     * @param versionId the version id to download. Use "latest" to get the last generated file
     * @return the turtle file as a text/turtle content
     */
    @CrossOrigin
    @RequestMapping(value = {"versions/{versionId}"}, produces = "text/turtle;charset=UTF-8")
    public final ResponseEntity<String> versions(@PathVariable String versionId) {
        final long startTime = System.currentTimeMillis();

        logger.info(STARTED + GET_A_VERSION);
        logger.info("versionId=" + versionId);
        ResponseEntity<String> result;

        File dir = new File(converterResultDir);

        File found = getFile(versionId, dir);

        if (found == null) {
            logger.warn("Not found: " + versionId);
            result = new ResponseEntity<>(versionId, HttpStatus.NOT_FOUND);
        } else {
            logger.info("return " + found.getName());
            result = getFileContent(found);
        }

        logger.info(GET_A_VERSION + " used " + (System.currentTimeMillis() - startTime));
        return result;
    }


    /**
     * Reads the file and drops it to a ResponseEntity.
     *
     * @param found the file to read
     * @return response with the file as text content.
     */
    ResponseEntity<String> getFileContent(File found) {
        ResponseEntity<String> result;

       try (Stream<String> stream = Files.lines(found.toPath())) {
            StringBuilder sb = new StringBuilder();
            stream.forEach(line -> sb.append(line).append(System.lineSeparator()));
            return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
        } catch (IOException | InvalidPathException e) {
            logger.error("Unable to retrieve file {}",e.getMessage(),e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds a file in the publish directory.
     *
     * @param versionId the id or substring to match
     * @param dir the directory to search
     * @return the file that matches versionId
     */
    File getFile(@PathVariable String versionId, File dir) {
        File found = null;

        File[] versions = dir.listFiles();
        if (versions != null) {
            if ("latest".equals(versionId)) {
                long modified = -1;
                for (File f : versions) {
                    logger.debug(f.getName() + " " + f.lastModified());
                    if (f.getName().endsWith(".ttl") &&modified < f.lastModified()) {
                            modified = f.lastModified();
                            found = f;
                    }
                }
            } else {
                for (File f : versions) {
                    if (f.getName().contains(versionId)) {
                        found = f;
                        break;
                    }
                }
            }
        }
        return found;
    }

    /**
     * Simple method to list the gdoc converted versions that has been generated.
     *
     * @return the output of the ls command in the service's publish directory
     */
    @CrossOrigin
    @RequestMapping(value = {LIST_VERSIONS}, produces = "text/plain;charset=UTF-8")
    public final ResponseEntity<String> list() {
        final long startTime = System.currentTimeMillis();
        logger.info(STARTED + LIST_VERSIONS);
        ResponseEntity<String> result;

        Process process;
        String line;
        try {
            ProcessBuilder pb = new ProcessBuilder("ls");
            pb.directory(new File(converterResultDir));
            File log = File.createTempFile("list", "log");
            pb.redirectOutput(log);
            pb.redirectError(log);

            process = pb.start();

            int retValue = process.waitFor();

            StringBuilder outMsg = new StringBuilder();
            BufferedReader logReader = new BufferedReader(
                    new InputStreamReader(new FileInputStream(log), StandardCharsets.UTF_8));
            while ((line = logReader.readLine()) != null) {
                outMsg.append(line);
                outMsg.append(System.lineSeparator());
            }
            logReader.close();

            String message = retValue + "\n" + outMsg.toString();
            logger.info(message);

            result = new ResponseEntity<>(message, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Unable to list versions {}",e.getMessage(),e);
            result = new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        logger.info(LIST_VERSIONS + " used " + (System.currentTimeMillis() - startTime));
        return result;

    }

}
