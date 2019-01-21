package no.dcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication(exclude = RepositoryRestMvcAutoConfiguration.class)
@EnableElasticsearchRepositories
public class RegisterApplication {
    public static void main(String... args) {
        SpringApplication.run(RegisterApplication.class, args);
    }
}

