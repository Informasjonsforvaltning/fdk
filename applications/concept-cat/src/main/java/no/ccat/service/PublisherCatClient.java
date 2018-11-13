package no.ccat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class PublisherCatClient extends no.dcat.client.publishercat.PublisherCatClient {
    @Autowired
    private Environment env;

    @Override
    public String getApiRootUrl(){
        return env.getProperty("application.apiRootUrl");
    }
}
