package no.difi.dcat.api.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;

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

	//Det må lages en egen PropertySourcePlaceholderConfigurer siden @PropertySource fortsatt ikke støtter yaml format.
	@Bean
	@Profile("default") //Skal kun brukes når spring_active_profiles inneholder default
	public static PropertySourcesPlaceholderConfigurer properties() {
		PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
		YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
		yaml.setResources(new ClassPathResource("src/test-local/resources/properties/local-properties.yml")); //Path til propertiesfiler som skal brukes for JUnit og kjøring på lokal maskin
		propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
		return propertySourcesPlaceholderConfigurer;
	}
	
}
