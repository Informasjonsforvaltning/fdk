package no.dcat.config;

import com.github.ulisesbocchio.spring.boot.security.saml.bean.SAMLConfigurerBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@Profile({"prod"})
public class MyServiceProviderConfig extends WebSecurityConfigurerAdapter {
    @Bean
    SAMLConfigurerBean saml() {
        return new SAMLConfigurerBean();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    private FdkSamlUserDetailsService fdkSamlUserDetailsService;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http.httpBasic()
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
                .requestMatchers(saml().endpointsMatcher())
                .permitAll()
                .and()
            .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()
            .exceptionHandling()
                .accessDeniedPage("/loginerror");
        // @formatter:on

        saml().serviceProvider().authenticationProvider().userDetailsService(fdkSamlUserDetailsService);
    }

}