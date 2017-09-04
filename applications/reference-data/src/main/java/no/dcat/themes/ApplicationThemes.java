package no.dcat.themes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching(proxyTargetClass=true)
public class ApplicationThemes {
    public static void main(String... args) {
        SpringApplication.run(ApplicationThemes.class, args);
    }

}
