package portal;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@RestController
public class FdkController extends WebMvcConfigurerAdapter {

//    @RequestMapping("/")
 //public String index() {
   //     return "Felles datakatalog!";
    //}

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("redirect:/portal.html");
    }

}
