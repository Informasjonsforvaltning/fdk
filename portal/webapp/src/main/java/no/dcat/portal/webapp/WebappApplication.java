package no.dcat.portal.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

/**
 * Main webapp application.
 */
@SpringBootApplication
public class WebappApplication extends WebMvcConfigurerAdapter {
    private static Logger logger = LoggerFactory.getLogger(WebappApplication.class);

    /**
     * Standard magic for starting the spring boot application.
     *
     * @param args any parameters that you want to transfer to the spring boot application
     */
    public static void main(final String[] args) {

        ApplicationContext ctx = SpringApplication.run(WebappApplication.class, args);
    }

    /**
     * Sets the default locale for the application.
     *
     * @return default session locale resolver object
     */
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver slr = new SessionLocaleResolver();
        slr.setDefaultLocale(new Locale("nb", "NO")); //Locale.forLanguageTag("nb-NO"));

        return slr;
    }

    /**
     * Configures the message properties file that contain the various langauge specific fields.
     *
     * @return the message source for the application
     */
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    /**
     * Makes the application to reload with correct language. This is done by adding the parameter ?lang=nb.
     *
     * @return the interceptor for changing locale
     */
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
        lci.setParamName("lang");
        return lci;
    }

    /**
     * Register the locale change interceptor.
     *
     * @param registry the interceptor registry that we want to register our interceptor in
     */
    @Override
    public final void addInterceptors(final InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

}
