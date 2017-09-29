package no.dcat.themes;

import org.springframework.beans.factory.config.Scope;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.SimpleThreadScope;

@SpringBootApplication
@EnableCaching(proxyTargetClass=true)
public class ApplicationThemes {
    public static void main(String... args) {
        ConfigurableApplicationContext run = SpringApplication.run(ApplicationThemes.class, args);
        Scope threadScope = new SimpleThreadScope();
        run.getBeanFactory().registerScope("thread", threadScope);

    }

}
