package no.dcat.config;

import com.github.ulisesbocchio.spring.boot.security.saml.annotation.EnableSAMLSSO;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile( {"prod", "st1"})
@EnableSAMLSSO
public class EnableSaml {
}
