package no.dcat.service;

import no.fdk.acat.bindings.ApiCatBindings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class ApiCatService extends ApiCatBindings {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl() {
        return env.getProperty("application.apiRootUrl");
    }
}
