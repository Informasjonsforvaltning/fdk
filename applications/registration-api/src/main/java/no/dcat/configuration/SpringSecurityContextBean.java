package no.dcat.configuration;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Spring bean to enable easier mocking of Spring Security static methods
 */
@Component
public class SpringSecurityContextBean {


    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
