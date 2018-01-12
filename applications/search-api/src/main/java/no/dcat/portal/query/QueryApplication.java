package no.dcat.portal.query;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.util.UrlPathHelper;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.paths.RelativePathProvider;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.http.HttpServletRequest;

@SpringBootApplication
@PropertySource("classpath:swagger.properties")
@EnableSwagger2
public class QueryApplication extends WebMvcConfigurerAdapter {
    @Value("${springfox.documentation.swagger.v2.path}")
    private String swagger2Endpoint;

    public static void main(String[] args) {
        System.setProperty("org.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH", "true");
        SpringApplication.run(QueryApplication.class, args);
    }

    // Needed to fix handling of encoded uri in dataset identifiers
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        UrlPathHelperFixed urlPathHelper = new UrlPathHelperFixed();
        urlPathHelper.setUrlDecode(false);
        configurer.setUrlPathHelper(urlPathHelper);
    }

    public class UrlPathHelperFixed extends UrlPathHelper {

        public UrlPathHelperFixed() {
            super.setUrlDecode(false);
        }

        @Override
        public void setUrlDecode(boolean urlDecode) {
            if (urlDecode) {
                throw new IllegalArgumentException("Handler [" + UrlPathHelperFixed.class.getName() + "] does not support URL decoding.");
            }
        }

        @Override
        public String getServletPath(HttpServletRequest request) {
            String servletPath = getOriginatingServletPath(request);
            return servletPath;
        }

        @Override
        public String getOriginatingServletPath(HttpServletRequest request) {
            String servletPath = request.getRequestURI().substring(request.getContextPath().length());
            return servletPath;
        }
    }

    @Bean
    public Docket swaggerDocket() {
        return new Docket(DocumentationType.SWAGGER_2)

                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())

                .build();
    }

}
