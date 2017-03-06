package no.dcat.portal.webapp;

/**
 * Created by nodavsko on 28.09.2016.
 */

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Settings for the model view controller configuration.
 * Currently not in use.
 *
 */
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {

    /**
     * Overrides the view controller.
     *
     * @param registry the view controller registry
     */
    @Override
    public final void addViewControllers(final ViewControllerRegistry registry) {
//        registry.addViewController("/datasets").setViewName("forward:/searchkit.html");

    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!registry.hasMappingForPattern("/dist/**")) {
            registry.addResourceHandler("/dist/**").addResourceLocations(
                    "classpath:/dist/");
        }

    }
}
