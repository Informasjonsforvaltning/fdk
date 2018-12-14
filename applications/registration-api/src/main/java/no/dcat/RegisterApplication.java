package no.dcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@ComponentScan("no.fdk.harvestqueue")
@SpringBootApplication
@EnableElasticsearchRepositories
public class RegisterApplication {
    public static void main(String... args) {
        SpringApplication.run(RegisterApplication.class, args);
    }
}

