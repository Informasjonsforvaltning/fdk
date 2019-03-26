package no.fdk.searchapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import springfox.documentation.swagger.web.InMemorySwaggerResourcesProvider;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bjg on 14.09.2018.
 */
@Configuration
public class SwaggerWsEndpointsConfig {
    @Primary
    @Bean
    public SwaggerResourcesProvider swaggerResourcesProvider(InMemorySwaggerResourcesProvider defaultResourcesProvider) {
        return () -> {
            SwaggerResource apicatResource = new SwaggerResource();
            apicatResource.setName("National Api Directory search API");
            apicatResource.setSwaggerVersion("2.0");
            apicatResource.setLocation("/api-docs/api-cat");

            SwaggerResource conceptCatResource = new SwaggerResource();
            conceptCatResource.setName("National Concept Directory search API");
            conceptCatResource.setSwaggerVersion("2.0");
            conceptCatResource.setLocation("/api-docs/concept-cat");

            List<SwaggerResource> resources = new ArrayList<>(defaultResourcesProvider.get());
            resources.add(apicatResource);
            resources.add(conceptCatResource);
            return resources;
        };
    }
}
