package no.dcat.portal.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${application.simpleQueryServiceURL}")
    private String simpleQueryServiceURL;

    /**
     * The resultSet page
     *
     */
    @RequestMapping({"/"})
    String index (HttpSession session) {

        session.setAttribute("dcatQueryService", simpleQueryServiceURL);

        return "home";
    }
}
