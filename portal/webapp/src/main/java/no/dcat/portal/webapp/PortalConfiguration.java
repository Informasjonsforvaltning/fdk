package no.dcat.portal.webapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * Created by nodavsko on 17.10.2016.
 */
@Configuration
//@EnableAutoConfiguration
@PropertySource("classpath:project.properties") // for maven build properties
@PropertySource("classpath:git.properties") // for git properties
@ConfigurationProperties(prefix = "application") // for application.yml
public class PortalConfiguration {


    @Value("${spring.profiles.active:utvikling}")
    private String profile;

    /* application.queryServiceURL */
    private String queryServiceURL = "http://dummy.org/";
    public void setQueryServiceURL (String serviceURL) {
        this.queryServiceURL = serviceURL;
    }
    public String getQueryServiceURL() { return this.queryServiceURL; }


    public String getVersionInformation() {
        String versionInfo = artifactId + "-" + version + "/" + commitAbbrev +  "/" + buildDate + "/" + profile ;
        return versionInfo;
    }

    @Value("${git.commit.id.abbrev:}")
    private String commitAbbrev = "comAbbrev";

    @Value("${version:ver}")
    private String version;
    public String getVersion() { return version; }

    @Value("${artifactId:aid}")
    private String artifactId = "artifactId";
    public String getArtifactId() { return artifactId; }

    @Value("${build.date:1999-99-99}")
    private String buildDate;
    public void setBuildDate(String buildDate) { this.buildDate = buildDate; }
    public String getBuildDate() { return buildDate; }


/*
 @Bean
 public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
   PropertySourcesPlaceholderConfigurer c = new PropertySourcesPlaceholderConfigurer();
   c.setIgnoreUnresolvablePlaceholders(true);
  return c;
  }
*/
}
