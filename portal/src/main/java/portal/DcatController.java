package portal;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;

import java.io.FileReader;
import java.io.IOException;


/**
 * Created by nodavsko on 29.09.2016.
 */
@RestController
public class DcatController {
    Logger logger = LoggerFactory.getLogger(DcatController.class);

    @RequestMapping("/search")
    public String search(@RequestParam(value="q", defaultValue="") String query) {
        logger.debug("query: "+ query);

        /* Laster en json fil */

        ClassLoader classLoader = getClass().getClassLoader();
        String json = "{}";
        try {
            String u = classLoader.getResource("brreg-dataset-result.json").getFile();
            logger.debug(u);

            try (BufferedReader br = new BufferedReader(new FileReader(u))) {
                StringBuilder sb = new StringBuilder();
                String line = br.readLine();

                while ( line != null) {
                    sb.append(line);
                    sb.append(System.lineSeparator());
                    line = br.readLine();
                }
                json = sb.toString();

            } catch (IOException io) {
                logger.error("IO: "+io);
            }
            catch (Exception e) {
                logger.error("E: "+e);
            }

        } catch (NullPointerException npe) {
            logger.error("NP: ", npe);
        }

        return json;

    }

}
