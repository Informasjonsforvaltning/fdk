package no.ccat;

import com.google.common.base.Predicates;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@PropertySource("classpath:swagger.properties")
@EnableScheduling
@EnableSwagger2
public class CcatApiApplication {
    @Value("${springfox.documentation.swagger.v2.path}")
    private String swagger2Endpoint;

    public static void main(String[] args) {
        SpringApplication.run(CcatApiApplication.class, args);
    }

    @Bean
    public Docket swaggerDocket() {

        Set<String> secureProtocols = new HashSet<>();
        secureProtocols.add("https");

        return new Docket(DocumentationType.SWAGGER_2)
            .protocols(secureProtocols)
            .select()
            .apis(Predicates.not(RequestHandlerSelectors.basePackage("org.springframework.boot")))
            .paths(PathSelectors.any())
            .build()
            .ignoredParameterTypes(Pageable.class, PagedResourcesAssembler.class)
            .apiInfo(apiInfo());

    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
            "National Concept Directory Search API",
            "Provides a basic search api against the National Concept Directory of Norway",
            "1.0",
            "https://fellesdatakatalog.brreg.no/about",
            new Contact("Brønnøysundregistrene", "https://fellesdatakatalog.brreg.no", "fellesdatakatalog@brreg.no"),
            "License of API", "http://data.norge.no/nlod/no/2.0", Collections.emptyList());
    }

}

