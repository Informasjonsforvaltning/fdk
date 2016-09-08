package no.difi.dcat.admin.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix="application")
public class ApplicationSettings {

	private String harvesterUrl;
	private String kibanaLinkFirstHalf;
	private String kibanaLinkSecondHalf;

	public String getHarvesterUrl() {
		return harvesterUrl;
	}

	public void setHarvesterUrl(String harvesterUrl) {
		this.harvesterUrl = harvesterUrl;
	}

	public String getKibanaLinkFirstHalf() {
		return kibanaLinkFirstHalf;
	}

	public void setKibanaLinkFirstHalf(String kibanaLinkFirstHalf) {
		this.kibanaLinkFirstHalf = kibanaLinkFirstHalf;
	}

	public String getKibanaLinkSecondHalf() {
		return kibanaLinkSecondHalf;
	}

	public void setKibanaLinkSecondHalf(String kibanaLinkSecondHalf) {
		this.kibanaLinkSecondHalf = kibanaLinkSecondHalf;
	}
}
