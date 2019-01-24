package no.dcat.service;

import no.fdk.imcat.bindings.InformationmodelCatBindings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class InformationmodelCatService extends InformationmodelCatBindings {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl() {
        return env.getProperty("application.apiRootUrl");
    }
}
