package no.dcat.config;

import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderBuilder;
import com.github.ulisesbocchio.spring.boot.security.saml.configurer.ServiceProviderConfigurerAdapter;

//@Configuration
public class IdPortenServiceProviderConfig extends ServiceProviderConfigurerAdapter{

    @Override
    public void configure(ServiceProviderBuilder serviceProvider) throws Exception {
        serviceProvider
                .metadataGenerator()
                .entityId("difi.brreg.datakatalog.registrering.dev");
    }
}
