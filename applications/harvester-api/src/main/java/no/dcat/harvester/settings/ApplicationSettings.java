package no.dcat.harvester.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix="application")
public class ApplicationSettings {
	
	private int crawlerThreadPoolSize;
	
	private String elasticSearchHost;
	private int elasticSearchPort;
	private String elasticSearchCluster;
	private String referenceDataUrl;

	private String httpUsername;
	private String httpPassword;

	private String notificationMailSenderAddress;

	public String getHttpUsername() {
		return httpUsername;
	}

	public void setHttpUsername(String httpUsername) {
		this.httpUsername = httpUsername;
	}

	public String getHttpPassword() {
		return httpPassword;
	}

	public void setHttpPassword(String httpPassword) {
		this.httpPassword = httpPassword;
	}

	public String getElasticSearchHost() {
		return elasticSearchHost;
	}

	public void setElasticSearchHost(String elasticSearchHost) {
		this.elasticSearchHost = elasticSearchHost;
	}

	public int getElasticSearchPort() {
		return elasticSearchPort;
	}

	public void setElasticSearchPort(int elasticSearchPort) {
		this.elasticSearchPort = elasticSearchPort;
	}

	public void setElasticSearchCluster(String elasticSearchCluster) {this.elasticSearchCluster = elasticSearchCluster; }

	public String getElasticSearchCluster() { return elasticSearchCluster; }

	public int getCrawlerThreadPoolSize() {
		return crawlerThreadPoolSize;
	}

	public void setCrawlerThreadPoolSize(int crawlerThreadPoolSize) {
		this.crawlerThreadPoolSize = crawlerThreadPoolSize;
	}

	public String getReferenceDataUrl() {
		return referenceDataUrl;
	}

	public void setReferenceDataUrl(String referenceDataUrl) {
		this.referenceDataUrl = referenceDataUrl;
	}

	public String getNotificationMailSenderAddress() {return notificationMailSenderAddress; }

	public void setNotificationMailSenderAddress(String mailSenderAddress) {this.notificationMailSenderAddress = mailSenderAddress; }
}
