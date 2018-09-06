package no.acat.service;

import no.dcat.client.referencedata.ReferenceDataClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class ReferenceDataService {
    @Value("${application.referenceDataUrl}")
    private String referenceDataUrl;

    private ReferenceDataClient client;

    public ReferenceDataClient getClient() {
        return client;
    }

    @PostConstruct
    void validate() {
        assert referenceDataUrl != null;
        client = new ReferenceDataClient(referenceDataUrl);
    }
}
