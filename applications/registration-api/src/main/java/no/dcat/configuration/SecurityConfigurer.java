package no.dcat.configuration;

import com.github.ulisesbocchio.spring.boot.security.saml.annotation.EnableSAMLSSO;
import com.github.ulisesbocchio.spring.boot.security.saml.bean.SAMLConfigurerBean;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderBuilder;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderConfigurerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import javax.annotation.PostConstruct;

@Configuration
@Profile( {"prod", "st1"})
@EnableSAMLSSO
public class SecurityConfigurer extends ServiceProviderConfigurerAdapter {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfigurer.class);

    @Bean
    SAMLConfigurerBean saml() {
        return new SAMLConfigurerBean();
    }

    @Autowired
    FdkSamlUserDetailsService fdkSamlUserDetailsService;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        logger.info("saml-configure http security ...");

        // @formatter:off
        http
            .httpBasic()
                .disable()
            .csrf()
                .disable()
                    .anonymous()
        .and()
            .apply(saml())
        .and()
            .authorizeRequests()
                .antMatchers("/*.js").permitAll()
                .antMatchers("/*.woff2").permitAll()
                .antMatchers("/*.woff").permitAll()
                .antMatchers("/*.ttf").permitAll()
                .antMatchers("/assets/**").permitAll()
                .antMatchers("/loggetut").permitAll()
                .antMatchers("/loginerror").permitAll()
                .antMatchers("/logout").permitAll()
                .requestMatchers(saml().endpointsMatcher()).permitAll()
                .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
        .and()
            .authorizeRequests()
                .antMatchers(HttpMethod.GET,"/catalogs/**").permitAll()
                .antMatchers(HttpMethod.GET, "/public/**").permitAll()
                .anyRequest().authenticated()
        .and()
            .logout()
                .logoutUrl("/logout")
        ;
        // @formatter:on
    }

    @Override
    public void configure(ServiceProviderBuilder serviceProvider) throws Exception {
        logger.info("saml-configure service provider ...");

        // @formatter:off
        serviceProvider
            .authenticationProvider().userDetailsService(fdkSamlUserDetailsService)
            .and()
                .sso()
                    .successHandler(loginSuccessHandler())
            .and()
                .logout()
                    .successHandler(logoutSuccesHandler());
        // @formatter:on
    }


    @Value("${saml.sso.context-provider.lb.scheme}")
    String contextProviderLbScheme;

    @Value("${saml.sso.context-provider.lb.context-path}")
    String contextProviderLbContextPath;

    @Value("${saml.sso.context-provider.lb.server-name}")
    String contextProviderLbServerName;

    @Value("${saml.sso.context-provider.lb.server-port}")
    String contextProviderLbServerPort;

    @Value("${saml.sso.context-provider.lb.include-server-port-in-request-url}")
    boolean contextProviderLbIncludeServerPortInRequestUrl;

    private String frontendBaseUrl;

    @PostConstruct
    public void postConstruct(){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder
                .append(contextProviderLbScheme).append("://")
                .append(contextProviderLbServerName);
        if (contextProviderLbIncludeServerPortInRequestUrl) {
            stringBuilder.append(":").append(contextProviderLbServerPort);
        }
        stringBuilder.append(contextProviderLbContextPath);

        frontendBaseUrl = stringBuilder.toString();
    }

    private AuthenticationSuccessHandler loginSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler = new SimpleUrlAuthenticationSuccessHandler();
        handler.setRedirectStrategy((request, response, url) -> {
            logger.debug("loginSuccessRedirect: {}", frontendBaseUrl);
            response.sendRedirect(frontendBaseUrl);
        });
        return handler;
    }

    private LogoutSuccessHandler logoutSuccesHandler() {
        SimpleUrlLogoutSuccessHandler handler = new SimpleUrlLogoutSuccessHandler();
        handler.setRedirectStrategy((request, response, url) -> {
            logger.debug("logoutSuccessRedirect: {}", frontendBaseUrl);
            response.sendRedirect(frontendBaseUrl);
        });
        return handler;
    }

}
