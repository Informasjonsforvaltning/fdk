package no.dcat.testadmin;

import no.dcat.harvester.crawler.Loader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

/**
 * Created by nodavsko on 02.11.2016.
 */
@Controller
public class TestAdminController {

    private static Logger logger = LoggerFactory.getLogger(TestAdminController.class);

    @Value("${application.elasticsearchHost}")
    private String elasticSearchHost;

    @Value("${application.elasticsearchPort}")
    private int elasticSearchPort;

    @Value("${application.elasticsearchCluster}")
    private String elasticSearchCluster;


    /**
     * The resultSet page. Sets callback service and version identification and returns home.html page
     */
    @RequestMapping({"/"})
    String index(HttpSession session) {

        //session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

        //session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

        //logger.debug("Requestmapping / : es host: " + elasticSearchHost);
        //logger.debug("Requestmapping / : es port: " + elasticSearchPort);
        //logger.debug("Requestmapping / : es cluster: " + elasticSearchCluster);

        return "test"; // templates/home.html
    }


    /**
     * Returns file with datasets from Google docs spreadsheet
     *
     * @param session
     * @return
     */
    @RequestMapping({"/gdoc"})
    String gdoc(HttpSession session) {

        //session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

        //session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

        return "gdoc-2016-12-12.ttl"; // templates/home.html
    }


    /**
     * Delete dcat index from Elasticsearch
     *
     * @param response
     * @return HTTP 200 OK if index was deleted succesfully
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.DELETE, value = "esdata")
    public ResponseEntity<String> deleteEsdata(HttpServletResponse response) {
        HttpURLConnection httpCon = null;

        try {

            URL url = new URL("http://" + elasticSearchHost + ":9200/dcat");

            httpCon = (HttpURLConnection) url.openConnection();
            httpCon.addRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            httpCon.setRequestMethod("DELETE");

            logger.debug(httpCon.toString());
            //httpCon.getOutputStream().write("dcat".getBytes());

            int responseCode = httpCon.getResponseCode();

            if (responseCode == HttpStatus.OK.value()) {

                logger.info("Database deleted");
                return new ResponseEntity<String>(HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("Failed to delete", e);
        } finally {
            if (httpCon != null) {
                httpCon.disconnect();
            }
        }

        return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
    }


    /**
     * Load DCAT data file into elasticsearch
     *
     * @param filename Name of file to be loaded. Must be Turlte, json-ld or RFD/XML format
     * @param base64 Base64 encoded DCAT data
     * @param response
     * @return HTTP 200 OK if data was successfully loaded, HTTP 400 Bad request if loading did not succeed
     */
    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST, value = "load")
    public ResponseEntity<String> load(@RequestParam(value = "filename") String filename,
                                               @RequestParam(value = "data") String base64,
                                               HttpServletResponse response) {
        try {
            logger.info("Test load request: " +filename + " " + base64.length() + " " + response.getContentType());

            byte[] txt = DatatypeConverter.parseBase64Binary(base64.split(",")[1]);

            File tempDir = new File(System.getProperty("java.io.tmpdir"));

            String prefix = filename.substring(0,filename.indexOf('.'));
            String postfix = filename.substring(filename.indexOf('.'),filename.length());

            File tempFile = File.createTempFile(prefix, postfix, tempDir);
            FileOutputStream fos = new FileOutputStream(tempFile);
            fos.write(txt);
            fos.close();
            logger.debug(tempFile.getAbsolutePath());

            Loader loader = new Loader();

            //loader.loadDatasetFromFile(url.toString());
            String url = tempFile.toURL().toString();
            logger.debug ("reading tempfile " + url);


            //List<String> resultMsgs = loader.loadDatasetFromFile(url);
            List<String> resultMsgs = loader.loadDatasetFromFile(url, elasticSearchHost, elasticSearchPort, elasticSearchCluster);
            // Format results
            StringBuffer msg = new StringBuffer();
            boolean success = true;
            for (String s : resultMsgs) {
                if (s.contains("validation_error")) success = false;
                int index = s.indexOf(", crawler_id");
                String sub = null;
                if (index != -1) sub = s.substring(0,index);
                else sub = s;

                msg.append(sub + "\n");
            }

            String finalMessage = msg.toString();
            logger.debug(finalMessage);

            if (success) {
                logger.info("Load File Success");
                //String message = "{\"success\": \"" + filename + " successfully loaded!\"}";
                return new ResponseEntity<String>(finalMessage, HttpStatus.OK);
            } else {
                logger.info("Unsucsesfull in loading");
                return new ResponseEntity<String>(finalMessage, HttpStatus.BAD_REQUEST);
            }

        } catch (IOException e) {
            logger.error("Unable to load file due to {}",e.getMessage());
        }

        return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
    }

}