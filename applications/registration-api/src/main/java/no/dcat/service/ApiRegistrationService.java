package no.dcat.service;


import no.dcat.client.apiregistration.ApiRegistrationClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class ApiRegistrationService {
    @Value("${application.apiRegistrationUrl}")
    private String apiRegistrationUrl;

    public ApiRegistrationClient getClient() {
        return new ApiRegistrationClient(this.apiRegistrationUrl);
    }
}
