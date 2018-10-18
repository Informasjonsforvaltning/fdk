package no.dcat.client.apiregistration;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;

public class ApiRegistrationClient {
    private String apiregistrationUrl;

    public ApiRegistrationClient(String apiregistrationUrl) {
        this.apiregistrationUrl = apiregistrationUrl;
    }

    public Collection<ApiRegistrationPublic> getPublished() {

        RestTemplate restTemplate = new RestTemplate();
        PagedResources<ApiRegistrationPublic> pagedResources = restTemplate.exchange(this.apiregistrationUrl + "/public/apis", HttpMethod.GET, null, new ParameterizedTypeReference<PagedResources<ApiRegistrationPublic>>() {
        }).getBody();
        Collection<ApiRegistrationPublic> apiRegistrations = pagedResources.getContent();

        return apiRegistrations;
    }
}
