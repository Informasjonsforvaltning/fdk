package no.dcat.config;

import no.dcat.authorization.AuthorizationService;
import no.dcat.authorization.AuthorizationServiceException;
import no.dcat.authorization.EntityNameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import java.net.URL;
import java.util.HashSet;
import java.util.Set;

import static no.dcat.config.Roles.ROLE_USER;

/**
 * Created by bjg on 19.06.2017.
 * <p>
 * Configures basic auth for use in develop profile
 */
@Configuration
@Profile({"prod-localauth", "docker", "develop", "unit-integration"})
@EnableWebSecurity
public class BasicAuthConfig extends WebSecurityConfigurerAdapter {
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

    @Bean
    public AuthenticationSuccessHandler loginSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler = new SimpleUrlAuthenticationSuccessHandler();
        handler.setRedirectStrategy((request, response, url) -> {
            String referer = request.getHeaders("referer").nextElement();
            URL url1 = new URL(referer);
            String port = url1.getPort() != -1 ? ":" + url1.getPort() : "";
            referer = url1.getProtocol() + "://" + url1.getHost() + port + "/";
            logger.debug("loginSuccessRedirect: {}", referer);
            response.sendRedirect(referer);
        });
        return handler;
    }


    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {

        SimpleUrlLogoutSuccessHandler handler = new SimpleUrlLogoutSuccessHandler();
        handler.setRedirectStrategy((request, response, url) -> {
            String referer = request.getHeaders("referer").nextElement();
            URL url1 = new URL(referer);
            String port = url1.getPort() != -1 ? ":" + url1.getPort() : "";
            referer = url1.getProtocol() + "://" + url1.getHost() + port + "/";
            logger.debug("logoutSuccessRedirect: {}", referer);
            response.sendRedirect(referer);
        });
        return handler;
    }

    @Autowired
    AuthorizationService authorizationService;

    @Autowired
    EntityNameService entityNameService;


    @Autowired
    UserDetailsService basicUserDetailsService;

    @Bean
    public UserDetailsService getBasicUserDetailsService() {
        return personnummer -> {
            Set<GrantedAuthority> authorities = new HashSet<>();
            try {
                authorizationService.getOrganisations(personnummer)
                        .stream()
                        .map(SimpleGrantedAuthority::new)
                        .forEach(authorities::add);

                logger.info("Authorities {}", authorities);

            } catch (AuthorizationServiceException | RuntimeException e) {
                logger.error("Feil ved autorisasjon i Altinn {}", e);
            } finally {
                authorities.add(new SimpleGrantedAuthority(ROLE_USER));
            }
            return new User(personnummer, "password01", authorities);
        };
    }


    @Autowired
    public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(basicUserDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {


        http
                //.httpBasic()
                //     .and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/*.js").permitAll()
                .antMatchers("/*.woff2").permitAll()
                .antMatchers("/*.woff").permitAll()
                .antMatchers("/*.ttf").permitAll()
                .antMatchers("/assets/**").permitAll()
                .antMatchers("/loggetut").permitAll()
                .antMatchers("/loginerror").permitAll()
                .antMatchers("/innloggetBruker").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/health").permitAll()
                .antMatchers(HttpMethod.GET,"/catalogs/**").permitAll()

                .and()
                .authorizeRequests()

                .anyRequest().authenticated()
                .and()
                .formLogin()
                // .loginPage("/login")
                .permitAll()
                .successHandler(loginSuccessHandler())
                .failureUrl("/loginerror")
                .and()

                .logout()
                .logoutUrl("/logout")
                .logoutSuccessHandler(logoutSuccessHandler())
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
                .and()
                .exceptionHandling()
                .accessDeniedPage("/loginerror");


    }


}
