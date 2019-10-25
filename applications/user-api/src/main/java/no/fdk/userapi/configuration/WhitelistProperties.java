package no.fdk.userapi.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "application.whitelists")
public class WhitelistProperties {

    private List<String> orgNrWhitelist;
    private List<String> orgFormWhitelist;
    private List<String> adminList;

    public List<String> getOrgNrWhitelist() {
        return orgNrWhitelist;
    }

    public void setOrgNrWhitelist(String orgNrWhitelist) {
        this.orgNrWhitelist = Arrays.asList(orgNrWhitelist.split(","));
    }

    public List<String> getOrgFormWhitelist() {
        return orgFormWhitelist;
    }

    public void setOrgFormWhitelist(String orgFormWhitelist) {
        this.orgFormWhitelist = Arrays.asList(orgFormWhitelist.split(","));
    }

    public List<String> getAdminList() {
        return adminList;
    }

    public void setAdminList(String adminList) {
        this.adminList = Arrays.asList(adminList.split(","));
    }
}
