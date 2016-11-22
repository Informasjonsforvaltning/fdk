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

    /* application.queryServiceUrl */
    private String queryServiceUrl = "http://dummy.org/";

    public final void setQueryServiceUrl(final String serviceURL) {

        this.queryServiceUrl = serviceURL;
    }

    /**
     * Returns the URL to the query service.
     *
     * @return the query service URL string
     */
    public final  String getQueryServiceUrl() {

        return this.queryServiceUrl;
    }

    /* application.queryServiceUrl */
    private String retrieveDatasetServiceUrl = "http://dummy.org/detail";

    public void setRetrieveDatasetServiceUrl(String retrieveDatasetServiceUrl) {
        this.retrieveDatasetServiceUrl = retrieveDatasetServiceUrl;
    }

    public String getRetrieveDatasetServiceUrl() {

        return this.retrieveDatasetServiceUrl;
    }

    /* application.queryServiceURL */
    private String retrieveDatathemesServiceURL = "http://dummy.org/detail";
    public void setRetrieveDatathemesServiceURL (String retrieveDatasetServiceURL) {
        this.retrieveDatathemesServiceURL = retrieveDatasetServiceURL;
    }

    public String getRetrieveDatathemesServiceURL() {
        return this.retrieveDatathemesServiceURL;
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
    @Profile("development") //Skal kun brukes når spring_active_profiles inneholder development
    public static PropertySourcesPlaceholderConfigurer properties() {
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();

        //Path til propertiesfiler som skal brukes for JUnit og kjøring på lokal maskin
        yaml.setResources(new ClassPathResource("properties/local-properties.yml"));

        propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
        return propertySourcesPlaceholderConfigurer;
    }

}
