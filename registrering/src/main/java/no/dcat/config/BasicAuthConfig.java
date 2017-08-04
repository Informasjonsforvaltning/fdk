package no.dcat.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.authorization.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;

import java.io.IOException;
import java.util.*;

/**
 * Created by bjg on 19.06.2017.
 *
 * Configures basic auth for use in develop profile
 */
@Configuration
@Profile({"develop"})
public class BasicAuthConfig extends GlobalAuthenticationConfigurerAdapter{
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

    private Map<String, List<Entity>> userEntities = new HashMap<>();
    private Map<String, String> userNames = new HashMap<>();

    @Autowired
    AuthorizationService authorizationService;

    protected BasicAuthConfig() {
        userNames.put("23076102252", "GULLIKSEN MAUD");
        NameEntityService.SINGLETON.setUserName("23076102252", "GULLIKSEN MAUD");

    }

    /**
     * returns the organizations that this user is allowed to register dataset on
     *
     * @param ssn
     * @return list of organization numbers
     */
    public List<String> getOrganisations(String ssn) {
        List<String> organizations = new ArrayList<>();

        userEntities.get(ssn).forEach(entity -> {
            if (entity.getOrganizationNumber() != null) {
                organizations.add(entity.getOrganizationNumber());
                NameEntityService.SINGLETON.setOrganizationName(entity.getOrganizationNumber(),entity.getName());
            }
        });

        return organizations;
    }

    public String getUserName(String ssn) {
        return userNames.get(ssn);
    }

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    UserDetailsService userDetailsService = new UserDetailsService() {

        @Override
        public UserDetails loadUserByUsername(String ssn) throws UsernameNotFoundException {
            Set<GrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            authorizationService.getOrganisations(ssn)
                    .stream()
                    .map(SimpleGrantedAuthority::new)
                    .forEach(authorities::add);

            User user = new User(ssn,
                    "password",
                    authorities);
            return user;
        }
    };



    @Configuration
    @EnableWebSecurity
    @Profile({"develop"})
    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .csrf().disable()
                    .authorizeRequests()
                        .antMatchers("/*.js").permitAll()
                        .antMatchers("/*.woff2").permitAll()
                        .antMatchers("/*.woff").permitAll()
                        .antMatchers("/*.ttf").permitAll()
                        .antMatchers("/assets/**").permitAll()
                        .antMatchers("/loginerror").permitAll()

                        .anyRequest().authenticated()
                .and()

                    .formLogin()
                        .permitAll()
                        .failureUrl("/loginerror")
                .and()
                    .logout()
                        .logoutUrl("/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll();

        }
/*
        @Override
        protected void configure(AuthenticationManagerBuilder authManagerBuilder) throws Exception {
            authManagerBuilder.inMemoryAuthentication()
                    .withUser("user").password("password").roles("USER").authorities("974760673").and()
            .withUser("23076102252").password("password").roles("ROLE_USER").authorities("97476073");
        }
*/
    }

}
