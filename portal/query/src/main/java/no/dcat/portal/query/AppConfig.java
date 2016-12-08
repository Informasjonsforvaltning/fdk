package no.dcat.portal.query;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;

/**
 * Created by bjg on 04.11.2016.
 */
@Configuration
public class AppConfig {

    /**
     * PropertySourcePlaceholderConfigurer is used
     * as PrpoertySource dont support yaml format.

     * @return
     */
    @Bean
    @Profile("development") //Skal kun brukes når spring_active_profiles inneholder default
    public static PropertySourcesPlaceholderConfigurer properties() {
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer
                = new PropertySourcesPlaceholderConfigurer();
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();

        //Path til propertiesfiler som skal brukes for JUnit og kjøring på lokal maskin
        yaml.setResources(new ClassPathResource("properties/local-properties.yml"));
        propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
        return propertySourcesPlaceholderConfigurer;
    }
}
