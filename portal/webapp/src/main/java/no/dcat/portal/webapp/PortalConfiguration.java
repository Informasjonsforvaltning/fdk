package no.dcat.portal.webapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


/**
 * Created by nodavsko on 17.10.2016.
 */
@Configuration
@PropertySource("classpath:project.properties") // for maven build properties
@PropertySource("classpath:git.properties") // for git properties
@ConfigurationProperties(prefix = "application") // for application.yml
public class PortalConfiguration {

    @Value("${spring.profiles.active:development}")
    private String profile;

    /* application.queryServiceURL */
    private String queryServiceURL = "http://dummy.org/";
    public final void setQueryServiceURL(final String serviceURL) {

        this.queryServiceURL = serviceURL;
    }

    /**
     * Returns the URL to the query service.
     *
     * @return the query service URL string
     */
    public final  String getQueryServiceURL() {

        return this.queryServiceURL;
    }

    /**
     * Returns the version identification information for the application.
     *
     * @return the version information string
     */
    public final String getVersionInformation() {
        String versionInfo = artifactId + "-"
                + version + "/"
                + commitAbbrev +  "/"
                + buildDate + "/"
                + profile;
        return versionInfo;
    }

    @Value("${git.commit.id.abbrev:gitcid}")
    private String commitAbbrev;

    @Value("${version:ver}")
    private String version;
    public final String getVersion() {
        return version;
    }

    @Value("${artifactId:aid}")
    private String artifactId = "artifactId";
    public final String getArtifactId() {
        return artifactId;
    }

    @Value("${build.date:1999-99-99}")
    private String buildDate;
    public final void setBuildDate(final String buildDateString) {
        buildDate = buildDateString;
    }
    public final String getBuildDate() {
        return buildDate;
    }

}
