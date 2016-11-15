package no.dcat.portal.webapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;


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

    /* application.queryServiceURL */
    private String retrieveDatasetServiceURL = "http://dummy.org/detail";
    public void setRetrieveDatasetServiceURL (String retrieveDatasetServiceURL) {
        this.retrieveDatasetServiceURL = retrieveDatasetServiceURL;
    }

    public String getRetrieveDatasetServiceURL() {
        return this.retrieveDatasetServiceURL;
    }

    public String getVersionInformation() {
        String versionInfo = artifactId + "-" + version + "/" + commitAbbrev +  "/" + buildDate + "/" + profile ;
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

    //Det må lages en egen PropertySourcePlaceholderConfigurer siden @PropertySource fortsatt ikke støtter yaml format.
    @Bean
    @Profile("default") //Skal kun brukes når spring_active_profiles inneholder default
    public static PropertySourcesPlaceholderConfigurer properties() {
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
        yaml.setResources(new ClassPathResource("src/test-local/resources/properties/local-properties.yml")); //Path til propertiesfiler som skal brukes for JUnit og kjøring på lokal maskin
        propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
        return propertySourcesPlaceholderConfigurer;
    }

}
