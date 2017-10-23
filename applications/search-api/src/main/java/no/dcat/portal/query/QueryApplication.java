package no.dcat.portal.query;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

@SpringBootApplication
public class QueryApplication extends WebMvcConfigurerAdapter {

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

}
