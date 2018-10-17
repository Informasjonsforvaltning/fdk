package no.dcat.portal.query;

import com.google.common.base.Predicates;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.util.UrlPathHelper;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@PropertySource("classpath:swagger.properties")
@EnableSwagger2
public class QueryApplication extends WebMvcConfigurerAdapter {
    @Value("${springfox.documentation.swagger.v2.path}")
    private String swagger2Endpoint;

    public static void main(String[] args) {
        System.setProperty("org.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH", "true");
        SpringApplication.run(QueryApplication.class, args);
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
                .apiInfo(apiInfo());

    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
                "National Data Directory Search API",
                "Provides a basic search api against the National Data Directory of Norway",
                "1.0",
                "https://fellesdatakatalog.brreg.no/about",
                new Contact("Brønnøysundregistrene", "https://fellesdatakatalog.brreg.no", "fellesdatakatalog@brreg.no"),
                "License of API", "http://data.norge.no/nlod/no/2.0", Collections.emptyList());
    }

}
