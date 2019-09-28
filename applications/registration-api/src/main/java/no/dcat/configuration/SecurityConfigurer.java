package no.dcat.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.jwk.JwkTokenStore;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfigurer extends ResourceServerConfigurerAdapter {

    private ResourceServerProperties resourceServerProperties;

    @Autowired
    public SecurityConfigurer(ResourceServerProperties resourceServerProperties) {
        this.resourceServerProperties = resourceServerProperties;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(resourceServerProperties.getResourceId());
    }

    @Override
    public void configure(final HttpSecurity http) throws Exception {

        http.httpBasic().disable();

        http.csrf().disable();

        http.anonymous();

        http.sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.cors().configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.applyPermitDefaultValues();
            config.addAllowedMethod(HttpMethod.PATCH);
            config.addAllowedMethod(HttpMethod.DELETE);
            config.addAllowedMethod(HttpMethod.PUT);
            return config;
        });

        http.authorizeRequests()
            .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
            .antMatchers(HttpMethod.GET, "/catalogs/**").permitAll()
            .antMatchers(HttpMethod.GET, "/public/**").permitAll()
            .anyRequest().authenticated();
    }

}
