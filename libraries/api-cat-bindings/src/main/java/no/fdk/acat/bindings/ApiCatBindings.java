package no.fdk.acat.bindings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import no.fdk.acat.common.model.apispecification.ApiSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.POST;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiCatBindings {
    private static Logger logger = LoggerFactory.getLogger(ApiCatBindings.class);

    private String apiRootUrl;

    private static String getMessage(ConvertResponse response) {
        if (response.getMessages() != null) {
            if (response.getMessages().size() > 0) {
                return response.getMessages().get(0);
            } else {
                return response.getMessages().toString();
            }
        } else {
            return "Unknown error";
        }

    }

    private String getApisApiRootUrl() {
        return getApiRootUrl() + "/apis";
    }

    public void triggerHarvestApiRegistration(String apiRegistrationId) {
        RestTemplate restTemplate = new RestTemplate();
        String triggerUrl = getApisApiRootUrl() + "/trigger/harvest/apiregistration/" + apiRegistrationId;

        try {
            restTemplate.exchange(triggerUrl, POST, null, Void.class);
        } catch (Exception e) {
            String errorMessage = "Failed sending harvest trigger message " + triggerUrl;
            logger.error(errorMessage, e);
        }
    }

    private ConvertResponse convert(String url, String spec) {
        RestTemplate restTemplate = new RestTemplate();

        ConvertRequest request = ConvertRequest.builder()
            .url(url)
            .spec(spec)
            .build();

        HttpEntity<ConvertRequest> requestEntity = new HttpEntity<>(request);

        ConvertResponse convertResponse = restTemplate.exchange(getApisApiRootUrl() + "/convert", POST, requestEntity, ConvertResponse.class).getBody();

        return convertResponse;
    }

    private ApiSpecification convertToApiSpecification(String url, String spec) {
        ConvertResponse convertResponse = convert(url, spec);
        ApiSpecification apiSpecification = convertResponse.apiSpecification;

        if (apiSpecification == null) {
            throw new Error("Conversion error: " + getMessage(convertResponse));
        }
        return apiSpecification;
    }

    public ApiSpecification convertSpecToApiSpecification(String spec) {
        return convertToApiSpecification("", spec);
    }

    public ApiSpecification convertSpecUrlToApiSpecification(String url) {
        return convertToApiSpecification(url, "");
    }


}

