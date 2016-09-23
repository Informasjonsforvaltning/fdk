package no.dcat.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class LocalCatalogApplication {


    /*@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(LocalCatalogApplication.class);
    }*/

    public static void main(String[] args) throws Exception {
        SpringApplication.run(LocalCatalogApplication.class, args);
    }

}