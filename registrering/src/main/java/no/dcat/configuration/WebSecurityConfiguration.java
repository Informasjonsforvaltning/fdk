package no.dcat.configuration;

import com.google.common.collect.Lists;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

@Configuration
public class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

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

    @Bean
    UserDetailsService userDetailsService() {
        return username -> accesses
                .stream()
                .filter(access -> access.getUsername().equals(username))
                .map(access -> new User(access.getUsername(), access.getPassword(), AuthorityUtils.createAuthorityList(access.getOrgnr())))
                .findAny()
                .orElseThrow(() -> new UsernameNotFoundException("not found" + username));
    }

    @EnableWebSecurity
    @Configuration
    class WebSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            String catalogsPath = "/catalogs/**";
            http.authorizeRequests()
                    .antMatchers(HttpMethod.DELETE, catalogsPath).authenticated()
                    .antMatchers(HttpMethod.POST, catalogsPath).authenticated()
                    .antMatchers(HttpMethod.PUT, catalogsPath).authenticated()
                    .antMatchers(HttpMethod.PATCH, catalogsPath).authenticated()
                    .anyRequest()
                    .permitAll()
                    .and()
                    .httpBasic().and().
                    csrf().disable();
        }
    }

}
