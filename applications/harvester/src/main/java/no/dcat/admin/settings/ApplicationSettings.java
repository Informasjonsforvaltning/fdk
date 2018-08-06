package no.dcat.admin.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "application")
public class ApplicationSettings {

    private String harvesterUrl;

    //username/pwd for new admin user. It is created if it does not already exist in Fuseki
    private String adminUsername;
    private String adminPassword;

    public String getHarvesterUrl() {
        return harvesterUrl;
    }

    public void setHarvesterUrl(String harvesterUrl) {
        this.harvesterUrl = harvesterUrl;
    }

    public String getAdminUsername()  { return adminUsername; }

    public void setAdminUsername(String adminUsername) { this.adminUsername = adminUsername; }

    public String getAdminPassword()  { return adminPassword; }

    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }

}
