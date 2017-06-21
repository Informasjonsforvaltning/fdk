package no.dcat.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.authorization.AuthorizationService;
import no.dcat.authorization.Entity;
import no.dcat.authorization.TestUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
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

    private static Map<String, List<Entity>> userEntities = new HashMap<>();
    private static Map<String, String> userNames = new HashMap<>();



    protected BasicAuthConfig() {
        try {
            ClassPathResource testUsersResource = new ClassPathResource("data/testUsers.json");
            ObjectMapper mapper = new ObjectMapper();
            List<TestUser> users = mapper.readValue(testUsersResource.getInputStream(), new TypeReference<List<TestUser>>() {
            });

            users.forEach(user -> {
                logger.debug("TestUser {} ", user.getSsn());
                String ssn = (String) user.getSsn();
                userEntities.put(ssn, user.getEntities());
                user.getEntities().forEach(entity -> {
                    if (entity.getSocialSecurityNumber() != null) {
                        userNames.put(ssn, entity.getName());
                        return;
                    }
                });
            });

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
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


    //@Bean
    UserDetailsService userDetailsService = new UserDetailsService() {
        @Override
        public UserDetails loadUserByUsername(String ssn) throws UsernameNotFoundException {
            //List of entities for ssn. One represents the user itself
            //the other are organizations the user is authorized for
            List<Entity> userAuthorizations = userEntities.get(ssn);
            Entity userEntity = null;
            List<String> authorizedOrganizations = new ArrayList<>();

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

            //heller bruke denne?
            //AuthorityUtils.commaSeparatedStringToAuthorityList()
            User user = new User(userEntity.getName(),
                    "password",
                    AuthorityUtils.createAuthorityList(authorizedOrganizations.toString()));
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
                    .authorizeRequests()
                    .antMatchers("/*.js").permitAll()
                    .antMatchers("/*.woff2").permitAll()
                    .antMatchers("/*.woff").permitAll()
                    .antMatchers("/*.ttf").permitAll()
                    .antMatchers("/assets/**").permitAll()
                    .antMatchers("/loggetut").permitAll()
                    .anyRequest().authenticated()
                    .and()
                    .formLogin()
                    .permitAll()
                    .and()
                    .logout()
                    .permitAll();
        }

    }
}
