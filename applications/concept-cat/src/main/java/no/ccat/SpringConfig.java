package no.ccat;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringConfig {
    @Bean
    public static BeanFactoryPostProcessor beanFactoryPostProcessor() {
        return new CustomScopeRegistration();
    }
}
