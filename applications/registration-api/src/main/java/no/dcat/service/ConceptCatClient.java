package no.dcat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class ConceptCatClient extends no.dcat.client.conceptcat.ConceptCatClient {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl() {
        return env.getProperty("application.apiRootUrl");
    }
}
