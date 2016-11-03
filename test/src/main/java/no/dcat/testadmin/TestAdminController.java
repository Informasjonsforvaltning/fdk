package no.dcat.testadmin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by nodavsko on 02.11.2016.
 */
@Controller
public class TestAdminController {

        private static Logger logger = LoggerFactory.getLogger(TestAdminController.class);



        /**
         * The resultSet page. Sets callback service and version identification and returns home.html page
         */
        @RequestMapping({"/"})
        String index (HttpSession session) {

            //session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

            //session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

            return "test"; // templates/home.html
        }

        @CrossOrigin
        @RequestMapping(method= RequestMethod.DELETE, value = "esdata")
        public ResponseEntity<String> deleteEsdata(HttpServletResponse response) {
            HttpURLConnection httpCon = null;

                try {

                        URL url = new URL("http://localhost:9200/dcat");

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
                        logger.error("Failed to delete",e);
                } finally {
                    if (httpCon != null) {
                        httpCon.disconnect();
                    }
                }

               return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);


        }
}
