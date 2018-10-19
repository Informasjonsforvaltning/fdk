package no.acat.service;

import no.dcat.client.registrationapi.RegistrationApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RegistrationApiService {
    private static final Logger logger = LoggerFactory.getLogger(RegistrationApiService.class);

    @Value("${application.registrationApiUrl}")
    private String apiRegistrationUrl;

    public RegistrationApiClient getClient() {
        return new RegistrationApiClient(this.apiRegistrationUrl, logger);
    }
}
