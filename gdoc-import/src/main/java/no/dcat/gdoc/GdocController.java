package no.dcat.gdoc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Enumeration;

/**
 * Created by dask on 19.12.2016.
 */
@Controller
public class GdocController {
    private static Logger logger = LoggerFactory.getLogger(GdocController.class);

    @CrossOrigin
    @RequestMapping(value = {"/harvest"})
    final ResponseEntity<String> result(final HttpServletRequest request, HttpSession session) {
        long start = System.currentTimeMillis();
        logger.info("Startet harvest of gdoc");
        String command = "bash dcat.sh;";
        logger.debug("command: " + command);

        Process p;
        String line;
        try {
            ProcessBuilder pb = new ProcessBuilder("bash", "dcat.sh");
            pb.directory(new File("/usr/local/dcat/"));

            p = pb.start();

            StringBuilder outMsg = new StringBuilder();
            StringBuilder errMsg = new StringBuilder();

            //process standard output stream
            BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((line = stdoutReader.readLine()) != null) {
                outMsg.append(line); outMsg.append("\n\n");
            }
            logger.debug("out: " +outMsg.toString());
            //process standard error stream
            BufferedReader errReader = new BufferedReader(new InputStreamReader(p.getErrorStream()));
            while ((line = errReader.readLine()) != null) {
                errMsg.append(line); errMsg.append("\n\n");
            }
            logger.debug("err: "+ errMsg.toString());

            int retValue = p.waitFor();
            //stdoutReader.close();
            //errReader.close();

            String message = "return: " + retValue + ",\n" +
                    "out: "+ outMsg.toString() + ",\n" +
                    "err: "+ errMsg.toString() + "\n";


            ResponseEntity<String> response = new ResponseEntity<String>(message, HttpStatus.OK);

            return response;

        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            logger.info("Harvest used: " + (System.currentTimeMillis() - start));
        }

    }

    @CrossOrigin
    @RequestMapping(value = {"/latest"}, produces = "application/json")
    final ResponseEntity<String>  latest() {
        long startTime = System.currentTimeMillis();
        logger.info("Startet latest");
        Process p;
        String line;
        try {
            ProcessBuilder pb = new ProcessBuilder("ls", "-l");
            pb.directory(new File("/usr/local/dcat/publish"));

            p = pb.start(); //Runtime.getRuntime().exec(command);

            logger.debug(p.toString());


            StringBuilder outMsg = new StringBuilder();
            StringBuilder errMsg = new StringBuilder();

            //process standard output stream
            BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((line = stdoutReader.readLine()) != null) {
                outMsg.append(line);
                outMsg.append("\n");
            }
            //process standard error stream
            BufferedReader errReader = new BufferedReader(new InputStreamReader(p.getErrorStream()));
            while ((line = errReader.readLine()) != null) {
                errMsg.append(line); errMsg.append("\n");
            }

            int retValue = p.waitFor();

            return new ResponseEntity<String>(outMsg.toString()+ "\n" + errMsg.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            logger.info("latest used " + (System.currentTimeMillis() - startTime));
        }

    };


}
