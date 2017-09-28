package no.dcat.portal.webapp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import javax.annotation.PostConstruct;


/**
 * Created by nodavsko on 17.10.2016.
 */
@Configuration
public class PortalConfiguration {
    private static Logger logger = LoggerFactory.getLogger(PortalConfiguration.class);

    private static final String QUERY_SERVICE_SEARCH = "/search";
    private static final String QUERY_SERVICE_DETAIL = "/detail";
    private static final String QUERY_SERVICE_THEMES = "/themes";
    private static final String QUERY_SERVICE_PUBLISHER = "/publisher";
    private static final String QUERY_THEME_COUNT = "/themecount";
    private static final String QUERY_SERVICE_PUBLISHER_COUNT = "/publishercount";



    @Value("${application.queryServiceExternal}")
    private String queryServiceExternal;

    @Value("${application.queryService}")
    private String queryService;

    @Value("${application.themeServiceExternalUrl}")
    private String themeServiceExternalUrl;

    @Value("${application.themeServiceUrl}")
    private String themeServiceUrl;


    @PostConstruct
    void validate(){
        assert queryServiceExternal != null;
        assert queryService != null;
        assert themeServiceUrl != null;
        assert themeServiceExternalUrl != null;

        logger.info("queryServiceExternal: {}",queryServiceExternal);
        logger.info("queryService        : {}",queryService);
        logger.info("themeService        : {}",themeServiceUrl);
        logger.info("themeServiceExternal: {}",themeServiceExternalUrl);

    }


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


    public String getThemeServiceExternalUrl() {
        return themeServiceExternalUrl;
    }

    public void setThemeServiceExternalUrl(String themeServiceExternalUrl) {
        this.themeServiceExternalUrl = themeServiceExternalUrl;
    }

    public String getThemeServiceUrl() {
        return themeServiceUrl;
    }

    public void setThemeServiceUrl(String themeServiceUrl) {
        this.themeServiceUrl = themeServiceUrl;
    }
}
