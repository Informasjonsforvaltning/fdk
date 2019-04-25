package no.fdk.authdemo.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

/**
 * SecurityConfigurer is to configure ResourceServer and HTTP Security.
 * <p>
 * Please make sure you check HTTP Security configuration and change is as per your needs.
 * </p>
 * <p>
 * application.
 */
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
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.resourceId(resourceServerProperties.getResourceId());
    }

    @Override
    public void configure(final HttpSecurity http) throws Exception {

        http

            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()

            .headers()
            .frameOptions()
            .disable()
            .and()

            .csrf()
            .disable()

            .authorizeRequests()
            .antMatchers("/demoapi/protected").hasRole("ADMIN")
            .anyRequest().permitAll();

    }

    @Bean
    public JwtAccessTokenCustomizer jwtAccessTokenCustomizer() {
        return new JwtAccessTokenCustomizer();
    }
}