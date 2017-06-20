package no.dcat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by bjg on 19.06.2017.
 *
 * Configures basic auth for use in develop profile
 */
public class BasicAuthConfig {
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

        @Autowired
        public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
            auth
                    .inMemoryAuthentication()
                    .withUser("bjg").password("123").roles("USER");
        }
    }
}
