package no.dcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;


@SpringBootApplication
@EnableElasticsearchRepositories
@EnableWebMvc
public class RegisterApplication {


    public static void main(String... args) {
        SpringApplication.run(RegisterApplication.class, args);
    }

}
