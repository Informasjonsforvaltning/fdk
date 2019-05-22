package no.ccat.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
@ConfigurationProperties(prefix="application.harvestsourcesuris")
public class HarvestURIList {
    private static final Logger logger = LoggerFactory.getLogger(HarvestURIList.class);
    private List<String> uriList = new ArrayList<>();
    private String urlOverride = "";
    private boolean hasUrlOverride = false;

    public HarvestURIList() {
        //deliberately empty constructor
    }

    public List<String> getUriList() {
        if (hasUrlOverride) {
            List<String> overrideList = new ArrayList<>();
            overrideList.add(urlOverride);
            return overrideList;
        } else {
            return uriList;
        }
    }

    public void setUriList(List<String> uriList) {
        this.uriList = uriList;
    }

    public String getUrlOverride() {
        return urlOverride;
    }

    public void setUrlOverride(String urlOverride) {
        logger.debug("Concept cat URL override was {} ", urlOverride);
        if (!"".equalsIgnoreCase(urlOverride)) {
            hasUrlOverride = true;
        }
        this.urlOverride = urlOverride;
    }
}
