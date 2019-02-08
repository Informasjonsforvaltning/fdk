package no.ccat.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
@ConfigurationProperties(prefix="application.harvestsourcesuris")
public class HarvestURIList {
    private List<String> uriList = new ArrayList<>();

    public HarvestURIList() {
        //deliberately empty constructor
    }

    public List<String> getUriList() {
        return uriList;
    }

    public void setUriList(List<String> uriList) {
        this.uriList = uriList;
    }
}
