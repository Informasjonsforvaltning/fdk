package no.acat.service;

import lombok.Getter;
import no.dcat.shared.DatasetReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;


@Service
public class DatasetCatClient {
    private static final Logger logger = LoggerFactory.getLogger(DatasetCatClient.class);

    @Value("${application.apiRootUrl}")
    @Getter
    private String apiRootUrl;

    Optional<DatasetReference> lookupDatasetReferenceByUri(String uri) {
        String lookupUrl = UriComponentsBuilder
            .fromHttpUrl(getApiRootUrl())
            .path("/datasets/byuri")
            .queryParam("uri", uri)
            .toUriString();

        try {
            RestTemplate restTemplate = new RestTemplate();
            return Optional.ofNullable(restTemplate.getForObject(lookupUrl, DatasetReference.class));
        } catch (Exception e) {
            logger.warn("Dataset lookup failed for uri={}. Error: {}", lookupUrl, e.getMessage());
            return Optional.empty();
        }
    }
}
