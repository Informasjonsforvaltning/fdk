package no.dcat.portal.query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class QueryApplication {
    private static Logger logger = LoggerFactory.getLogger(QueryApplication.class);

    public static void main(String[] args) {

        ApplicationContext ctx = SpringApplication.run(QueryApplication.class, args);
    }

}
