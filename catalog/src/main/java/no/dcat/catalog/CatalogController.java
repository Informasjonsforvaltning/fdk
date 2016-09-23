package no.dcat.catalog;

import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@RestController
public class CatalogController {

 @RequestMapping("/")
 public String index() {
        return "Lokal datakatalog!";
    }

    @RequestMapping(value="/dcat", produces={"application/json","application/xml"}, consumes="text/html")
    public String getDcat() {
        String file = "ÆØÅ";
        return file;
    }
    /*
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/cat").setViewName("redirect:/index.html");
    }
    */


}
