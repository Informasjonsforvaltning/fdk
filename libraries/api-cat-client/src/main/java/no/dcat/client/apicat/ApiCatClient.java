package no.dcat.client.apicat;

import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

public class ApiCatClient {
    private String apiCatUrl;

    public ApiCatClient(String apiCatUrl) {
        this.apiCatUrl = apiCatUrl;
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

    public OpenAPI convert(String url, String spec) {
        RestTemplate restTemplate = new RestTemplate();

        ConvertRequest request = ConvertRequest.builder()
            .url(url)
            .spec(spec)
            .build();

        HttpEntity<ConvertRequest> entity = new HttpEntity<>(request);

        ConvertResponse convertResponse = restTemplate.exchange(this.apiCatUrl + "/convert", HttpMethod.POST, entity, ConvertResponse.class).getBody();

        OpenAPI openAPI = convertResponse.openApi;

        if (openAPI == null) {
            throw new Error("Conversion error: " + getMessage(convertResponse));
        }

        return openAPI;
    }
}

