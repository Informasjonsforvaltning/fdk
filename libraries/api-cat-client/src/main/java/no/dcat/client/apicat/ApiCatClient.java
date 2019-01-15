package no.dcat.client.apicat;

import io.swagger.v3.oas.models.OpenAPI;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.POST;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiCatClient {
    private String apiRootUrl;

    private String getApisApiRootUrl(){
        return getApiRootUrl()+"/apis";
    }

    static String getMessage(ConvertResponse response) {
        if (response.getMessages() != null) {
            if (response.getMessages().size() == 1) {
                return response.getMessages().get(0);
            } else {
                return response.getMessages().toString();
            }
        } else {
            return "Unknown error";
        }

    }

    public void triggerHarvestApiRegistration(String apiRegistrationId) {
        RestTemplate restTemplate = new RestTemplate();

        restTemplate.exchange(getApisApiRootUrl() + "/trigger/harvest/apiregistration/" + apiRegistrationId, POST, null, Void.class);
    }

    public OpenAPI convert(String url, String spec) {
        RestTemplate restTemplate = new RestTemplate();

        ConvertRequest request = ConvertRequest.builder()
            .url(url)
            .spec(spec)
            .build();

        HttpEntity<ConvertRequest> requestEntity = new HttpEntity<>(request);

        ConvertResponse convertResponse = restTemplate.exchange(getApisApiRootUrl() + "/convert", POST, requestEntity, ConvertResponse.class).getBody();

        OpenAPI openAPI = convertResponse.openApi;

        if (openAPI == null) {
            throw new Error("Conversion error: " + getMessage(convertResponse));
        }

        return openAPI;
    }
}

