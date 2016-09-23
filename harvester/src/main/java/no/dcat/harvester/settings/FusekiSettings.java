package no.dcat.harvester.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix="fuseki")
public class FusekiSettings {

	private String dcatServiceUri;
	private String adminServiceUri;
	
	public String getDcatServiceUri() {
		return dcatServiceUri;
	}
	public void setDcatServiceUri(String dcatServiceUri) {
		this.dcatServiceUri = dcatServiceUri;
	}
	public String getAdminServiceUri() {
		return adminServiceUri;
	}
	public void setAdminServiceUri(String adminServiceUri) {
		this.adminServiceUri = adminServiceUri;
	}
	
	
}
