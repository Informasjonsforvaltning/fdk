package no.dcat.portal.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

/**
 * Delivers html pages to support the DCAT Portal application
 *
 * Created by nodavsko on 12.10.2016.
 */

@Controller
public class PortalController {
    private static Logger logger = LoggerFactory.getLogger(PortalController.class);

    private final PortalConfiguration buildMetadata;

    @Autowired
    public PortalController(PortalConfiguration metadata) {
        this.buildMetadata = metadata;
    }

    /**
     * The result page. Sets callback service and version identification and returns result.html page
     */
    @RequestMapping({"/"})
    String result(HttpSession session) {

        session.setAttribute("dcatQueryService", buildMetadata.getQueryServiceURL());

        logger.debug(buildMetadata.getQueryServiceURL());
        logger.debug(buildMetadata.getVersionInformation());

        session.setAttribute("versionInformation", buildMetadata.getVersionInformation());

        return "result"; // templates/result.html
    }
}
