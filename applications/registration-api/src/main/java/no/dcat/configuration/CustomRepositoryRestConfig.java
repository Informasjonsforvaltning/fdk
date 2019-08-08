package no.dcat.configuration;

import no.ccat.common.model.Concept;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class CustomRepositoryRestConfig extends RepositoryRestConfigurerAdapter {

    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {

        return new RepositoryRestConfigurerAdapter() {
            @Override
            public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
                config.exposeIdsFor(Catalog.class, Dataset.class, ApiRegistration.class, Concept.class);
            }
        };
    }
}
