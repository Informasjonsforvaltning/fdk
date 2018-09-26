package no.dcat.altinn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class)
public class AltinnAuthorizationMockApplication {

        public static void main(String... args) {
            SpringApplication.run(AltinnAuthorizationMockApplication.class, args);
        }

}
