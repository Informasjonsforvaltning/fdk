package portal;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class FdkController {

    @RequestMapping("/")
    public String index() {
        return "Felles datakatalog!";
    }

}
