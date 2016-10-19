import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by nodavsko on 18.10.2016.
 */
@SpringBootApplication
@Controller
public class TestApplication {

    @RequestMapping("/")
    public String home() {
        return "forward:/test.html";
    }

    public static void main(String[] args) {
        new SpringApplicationBuilder(TestApplication.class).properties(
                "server.port=9999", "security.basic.enabled=false").run(args);
    }

}
