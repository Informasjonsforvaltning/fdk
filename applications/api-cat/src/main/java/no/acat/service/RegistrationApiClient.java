package no.acat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class RegistrationApiClient extends no.dcat.client.registrationapi.RegistrationApiClient {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl() {
        return env.getProperty("application.apiRootUrl");
    }
}
