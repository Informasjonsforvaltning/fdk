package no.fdk.userapi.configuration;

import no.fdk.altinn.AltinnClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeansConfiguration {

    @Bean
    public AltinnClient altinnClient(@Value("${application.altinnProxyHost}") String altinnProxyHost) {
        return new AltinnClient(altinnProxyHost);
    }
}
