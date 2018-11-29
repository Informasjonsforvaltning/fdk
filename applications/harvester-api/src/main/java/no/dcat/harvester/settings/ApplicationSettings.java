package no.dcat.harvester.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix="application")
public class ApplicationSettings {

	private String referenceDataUrl;

	private String httpUsername;
	private String httpPassword;

	private String notificationMailSenderAddress;

	private String openDataEnhet;

	private int harvestRecordRetentionDays;

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

	public String getReferenceDataUrl() {
		return referenceDataUrl;
	}

	public void setReferenceDataUrl(String referenceDataUrl) {
		this.referenceDataUrl = referenceDataUrl;
	}

	public String getNotificationMailSenderAddress() {
		return notificationMailSenderAddress;
	}

	public void setNotificationMailSenderAddress(String mailSenderAddress) {
		this.notificationMailSenderAddress = mailSenderAddress;
	}

	public String getOpenDataEnhet() {
		return openDataEnhet;
	}

	public void setOpenDataEnhet(String openDataEnhet) {
		this.openDataEnhet = openDataEnhet;
	}

	public int getHarvestRecordRetentionDays() { return harvestRecordRetentionDays; }

	public void setHarvestRecordRetentionDays(int harvestRecordRetentionDays) {
	    this.harvestRecordRetentionDays = harvestRecordRetentionDays;
	}
}
