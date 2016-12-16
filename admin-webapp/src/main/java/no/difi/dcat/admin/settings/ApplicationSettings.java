package no.difi.dcat.admin.settings;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;

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

	//Det må lages en egen PropertySourcePlaceholderConfigurer siden @PropertySource fortsatt ikke støtter yaml format.
	@Bean
	@Profile("development") //Skal kun brukes når spring_active_profiles inneholder default
	public static PropertySourcesPlaceholderConfigurer properties() {
		PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
		YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
		yaml.setResources(new ClassPathResource("properties/local-properties.yml")); //Path til propertiesfiler som skal brukes for JUnit og kjøring på lokal maskin
		propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
		return propertySourcesPlaceholderConfigurer;
	}
}
