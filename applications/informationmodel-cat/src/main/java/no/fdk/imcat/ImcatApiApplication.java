package no.fdk.imcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;

@SpringBootApplication(exclude = RepositoryRestMvcAutoConfiguration.class)
public class ImcatApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ImcatApiApplication.class, args);
    }
}

