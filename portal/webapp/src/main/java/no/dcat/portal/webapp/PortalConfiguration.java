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
@ConfigurationProperties(prefix = "application") // for application.yml
public class PortalConfiguration {

    private static final String QUERY_SERVICE_SEARCH = "/search";
    private static final String QUERY_SERVICE_DETAIL = "/detail";
    private static final String QUERY_SERVICE_THEMES = "/themes";
    private static final String QUERY_SERVICE_PUBLISHER = "/publisher";
    private static final String QUERY_THEME_COUNT = "/themecount";
    private static final String QUERY_SERVICE_PUBLISHER_COUNT = "/publishercount";

    @Value("${spring.profiles.active:development}")
    private String profile;

    @Value("${queryServiceExternal:qse}")
    private String queryServiceExternal;

    @Value("${queryService:qs}")
    private String queryService;


    public final String getQueryServiceExternal() {

        return queryServiceExternal;
    }

    public final void setQueryServiceExternal(final String serviceUrl) {

        queryServiceExternal = serviceUrl;
    }



    public final void setQueryService(final String serviceUrl) {

        this.queryService = serviceUrl;
    }

    /**
     * Returns the URL to the query service.
     *
     * @return the query service URL string
     */
    public final  String getQueryService() {

        return this.queryService;
    }

    public final String getSearchServiceUrl() {
        return getQueryService() + QUERY_SERVICE_SEARCH;
    }

    public final String getThemeServiceUrl() {
        return getQueryService() + QUERY_SERVICE_THEMES;
    }

    public final String getPublisherServiceUrl() {
        return getQueryService() + QUERY_SERVICE_PUBLISHER;
    }

    public final String getPublisherCountServiceUrl() {
        return getQueryService() + QUERY_SERVICE_PUBLISHER_COUNT;
    }

    public final String getDetailsServiceUrl() {
        return getQueryService() + QUERY_SERVICE_DETAIL;
    }

    public final String getThemeCounterUrl() {
        return getQueryService() + QUERY_THEME_COUNT;
    }


}
