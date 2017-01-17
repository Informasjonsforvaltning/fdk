package no.dcat.bddtest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

/**
 * Created by bjg on 02.01.2017.
 */

@SpringBootApplication
public class BddTestApplication {
    private static Logger logger = LoggerFactory.getLogger(BddTestApplication.class);

    public static void main(String[] args) {

        ApplicationContext ctx = SpringApplication.run(BddTestApplication.class, args);
    }

}
