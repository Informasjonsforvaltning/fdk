package no.dcat.portal.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Properties;

/**
 * Delivers html pages to support the DCAT Portal application
 *
 * Created by nodavsko on 12.10.2016.
 */
@Controller
@EnableAutoConfiguration
@PropertySource("project.properties") // for maven build properties
@PropertySource("git.properties") // for git properties
@ConfigurationProperties(prefix = "application") // for application.yml
public class PortalController {
    private static Logger logger = LoggerFactory.getLogger(PortalController.class);


    @Value("${spring.profiles.active}")
    private String profile = "utvikling";

    /* application.queryServiceURL */
    private String queryServiceURL;
    public void setQueryServiceURL (String serviceURL) {
        this.queryServiceURL = serviceURL;
    }

    @Value("${git.commit.id.abbrev}")
    private String commitAbbrev;

    @Value("${version}")
    private String version;

    @Value("${artifactId}")
    private String artifactId;

    @Value("${build.date}")
    private String buildDate;



    /**
     * The resultSet page. Sets callback service and version identification and returns home.html page.
     *
     */
    @RequestMapping({"/"})
    String index (HttpSession session) {

        session.setAttribute("dcatQueryService", queryServiceURL);

        logger.debug(queryServiceURL);
        String versionInfo = artifactId + "-" + version + "/" + commitAbbrev +  "/" + buildDate + "/" + profile ;
        logger.debug(versionInfo);

        session.setAttribute("versionInformation",versionInfo);

        return "home"; // templates/home.html
    }
}
