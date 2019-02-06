package no.acat.service;

import no.fdk.registration.bindings.RegistrationApiBindings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class RegistrationApiClient extends RegistrationApiBindings {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl() {
        return env.getProperty("application.apiRootUrl");
    }
}
