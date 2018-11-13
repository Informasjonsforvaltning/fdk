package no.dcat.client.publishercat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import no.dcat.shared.Publisher;
import org.springframework.web.client.RestTemplate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PublisherCatClient {
    private String apiRootUrl;

    public Publisher getByOrgNr(String orgNr) {
        RestTemplate restTemplate = new RestTemplate();

        String resourceUrl = getApiRootUrl() + "/publishers/{orgNr}";

        return restTemplate.getForObject(resourceUrl, Publisher.class, orgNr);
    }
}

