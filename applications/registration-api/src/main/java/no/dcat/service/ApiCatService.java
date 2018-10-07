package no.dcat.service;

import no.dcat.client.apicat.ApiCatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class ApiCatService {
    @Value("${application.apiCatUrl}")
    private String apiCatUrl;

    public ApiCatClient getClient() {
        return new ApiCatClient(this.apiCatUrl);
    }
}
