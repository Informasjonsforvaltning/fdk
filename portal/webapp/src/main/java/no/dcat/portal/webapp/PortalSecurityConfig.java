package no.dcat.portal.webapp;

/**
 * Created by nodavsko on 28.09.2016.
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Security settings for the project.
 */
@Configuration
@EnableWebSecurity
public class PortalSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
   protected final void configure(final HttpSecurity http) throws Exception {

        http
            .authorizeRequests()
                .antMatchers("/", "/result", "/details").permitAll()
                //.anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll();
    }

    /**
     * Possible login code. Experimental and not in use.
     * @param auth the autorisation object
     * @throws Exception if the user is not authenticated.
     */
    @Autowired
    public final void configureGlobal(final AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
            .withUser("user").password("password").roles("USER");
    }
}
