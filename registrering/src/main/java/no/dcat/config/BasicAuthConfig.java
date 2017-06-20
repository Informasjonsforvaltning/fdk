package no.dcat.config;

import com.google.common.collect.Lists;
import no.dcat.configuration.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

/**
 * Created by bjg on 19.06.2017.
 *
 * Configures basic auth for use in develop profile
 */
@Configuration
@Profile({"develop"})
public class BasicAuthConfig extends GlobalAuthenticationConfigurerAdapter{

    private List<Access> accesses = setupDummyUsers();

    private List<Access> setupDummyUsers() {
        return Lists.newArrayList(
                Access.builder().username("mgs").password("123").orgnr("974761076").build(),
                Access.builder().username("bjg").password("123").orgnr("974760673").build(),
                Access.builder().username("dask").password("123").orgnr("889640782").build()
        );
    }

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService());
    }

    //Todo: her må det kobles til atuoritets-servicen som David har laget
    @Bean
    UserDetailsService userDetailsService() {
        return username -> accesses
                .stream()
                .filter(access -> access.getUsername().equals(username))
                .map(access -> new User(access.getUsername(), access.getPassword(), AuthorityUtils.createAuthorityList(access.getOrgnr())))
                .findAny()
                .orElseThrow(() -> new UsernameNotFoundException("not found" + username));
    }


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

        //@Autowired
        //public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        //    auth
        //            .inMemoryAuthentication()
        //            .withUser("bjg").password("123").roles("USER");
        //}
    }
}
