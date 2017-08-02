package no.dcat.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.authorization.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

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



    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }


    UserDetailsService userDetailsService = new UserDetailsService() {
        @Override
        public UserDetails loadUserByUsername(String ssn) throws UsernameNotFoundException {
            //List of entities for ssn. One represents the user itself
            //the other are organizations the user is authorized for
            List<Entity> userAuthorizations = null; //userEntities.get(ssn);
            Entity userEntity = null;
            List<String> authorizedOrganizations = new ArrayList<>();

            //if(userAuthorizations.size() == 0) {
            //    throw new UserNotAuthorizedException(ssn);
            //}
            logger.debug("userAutorizations.size: " + userAuthorizations.size());

            if(userAuthorizations.size() > 0) {
                //find the entry representing the user itself
                for(Entity entry : userAuthorizations) {
                    if (entry.getSocialSecurityNumber() != null) {
                        userEntity = entry;
                    }
                }

                //find the organizations the user can act on behalf of
                userAuthorizations.forEach(entity -> {
                    if (entity.getOrganizationNumber() != null) {
                        authorizedOrganizations.add(entity.getOrganizationNumber());
                    }
                });
            } else {
                throw new UsernameNotFoundException("Username not found for user with id: " + ssn);
            }


            User user = new User(userEntity.getName(),
                    "password",
                    AuthorityUtils.commaSeparatedStringToAuthorityList(String.join(",", authorizedOrganizations)));
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

    }
}
