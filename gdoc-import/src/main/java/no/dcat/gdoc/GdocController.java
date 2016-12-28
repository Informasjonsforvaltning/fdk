package no.dcat.gdoc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * Created by dask on 19.12.2016.
 */
@Controller
public class GdocController {

    private static Logger logger = LoggerFactory.getLogger(GdocController.class);

    private static final String GET_A_VERSION = "versions/{versionId}";
    private static final String LIST_VERSIONS = "versions";
    private static final String CONVERT_GDOC  = "convert";

    @Value("${application.converterHomeDir}")
    private String converterHomeDir ;

    public void setConverterHomeDir(final String converterHomeDir) {
        this.converterHomeDir = converterHomeDir;
    }

    @Value("${application.converterResultDir}")
    private String converterResultDir ;

    public void setConverterResultDir(final String converterResultDir) {
        this.converterResultDir = converterResultDir;
    }


    /**
     * Gets the google sheet document from google and converts it to turtle format. The resulting
     * file is stored with the current date in its filename. If convert is run more than once on
     * the same day the previous file for that day is overwritten.
     *
     * <p>The resulting turtle file can be accessed by the /versions service.
     *
     * @return the output log of the conversion run
     */
    @CrossOrigin
    @RequestMapping(value = {CONVERT_GDOC}, produces = "text/plain;charset=UTF-8")
    public final ResponseEntity<String> convert() {
        long start = System.currentTimeMillis();
        logger.info("Startet " + CONVERT_GDOC);
        String command = "bash dcat.sh;";
        logger.debug("command: " + command);

        Process process;
        String line;
        try {
            ProcessBuilder pb = new ProcessBuilder("bash", "dcat.sh");
            pb.directory(new File(converterHomeDir));
            File log = File.createTempFile("convert","log");
            pb.redirectOutput(log);
            pb.redirectError(log);

            process = pb.start();

            int retValue = process.waitFor();

            StringBuilder outMsg = new StringBuilder();
            BufferedReader logReader = new BufferedReader(
                    new InputStreamReader( new FileInputStream(log), StandardCharsets.UTF_8 ));
            while ((line = logReader.readLine()) != null) {
                // remove the bloody debug messages.
                // I didn't succed in adding log4j file to the semtex call
                if (!line.contains("DEBUG org.vedantatree.")) {
                    outMsg.append(line);
                    outMsg.append(System.lineSeparator());
                }
            }
            logReader.close();

            String message = "ReturnValue: " + retValue + "\n"
                    + outMsg.toString() + "\n" ;

            ResponseEntity<String> response = new ResponseEntity<String>(message, HttpStatus.OK);

            return response;

        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            logger.info(CONVERT_GDOC + " used " + (System.currentTimeMillis() - start));
        }

    }

    /**
     * Fetches a spesific version of the gdoc converted turtle file. A file will typically have
     * the generation date in the file name. This date (YYYY-MM-DD) is used as versionId.
     *
     * @param versionId the version id to download. Use "latest" to get the last generated file
     * @return the turtle file as a text/turtle content
     */
    @CrossOrigin
    @RequestMapping(value = { "versions/{versionId}"}, produces = "text/turtle;charset=UTF-8")
    public final ResponseEntity<String> versions(@PathVariable String versionId) {
        long startTime = System.currentTimeMillis();
        logger.info("Startet " + GET_A_VERSION);
        logger.info("versionId=" + versionId);

        File dir = new File(converterResultDir);

        File found = null;

        File[] versions = dir.listFiles();
        if (versions != null) {
            if ("latest".equals(versionId)) {
                long modified = 0;
                for (File f : versions) {
                    logger.debug(f.getName() + " " + f.lastModified());
                    if (modified < f.lastModified()) {
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

        if (found != null) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    found.toURI().toURL().openStream(), StandardCharsets.UTF_8))) {
                StringBuilder sb = new StringBuilder();
                String line = br.readLine();

                while (line != null) {
                    sb.append(line);
                    sb.append(System.lineSeparator());
                    line = br.readLine();
                }
                return new ResponseEntity<String>(sb.toString(), HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
            } finally {
                logger.info(GET_A_VERSION + " used " + (System.currentTimeMillis() - startTime));
            }
        } else {
            logger.info(GET_A_VERSION + " used " + (System.currentTimeMillis() - startTime));
            return new ResponseEntity<String>(versionId, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Simple method to list the gdoc converted versions that has been generated.
     *
     * @return the output of the ls command in the service's publish directory
     */
    @CrossOrigin
    @RequestMapping(value = {LIST_VERSIONS}, produces = "text/plain;charset=UTF-8")
    public final ResponseEntity<String>  list() {
        long startTime = System.currentTimeMillis();
        logger.info("Startet " + LIST_VERSIONS);

        Process process;
        String line;
        try {
            ProcessBuilder pb = new ProcessBuilder("ls");
            pb.directory(new File(converterResultDir));
            File log = File.createTempFile("list","log");
            pb.redirectOutput(log);
            pb.redirectError(log);

            process = pb.start();

            logger.debug(process.toString());

            int retValue = process.waitFor();

            StringBuilder outMsg = new StringBuilder();
            BufferedReader logReader = new BufferedReader(
                    new InputStreamReader( new FileInputStream(log), StandardCharsets.UTF_8 ));
            while ((line = logReader.readLine()) != null) {
                // remove the bloody debug messages.
                // I didn't succed in adding log4j file to the semtex call
                if (!line.contains("DEBUG org.vedantatree.")) {
                    outMsg.append(line);
                    outMsg.append(System.lineSeparator());
                }
            }
            logReader.close();

            return new ResponseEntity<String>(
                    retValue + "\n" + outMsg.toString(),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            logger.info(LIST_VERSIONS + " used " + (System.currentTimeMillis() - startTime));
        }

    }

}
