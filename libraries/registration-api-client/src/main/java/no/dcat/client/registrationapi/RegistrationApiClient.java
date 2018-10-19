package no.dcat.client.registrationapi;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;
import java.util.List;

/*
RegistrationApiClient is a library for consuming REST api with strong types.
 */
public class RegistrationApiClient {
    private String apiregistrationUrl;
    private Logger logger;

    public RegistrationApiClient(String apiregistrationUrl, Logger logger) {
        this.apiregistrationUrl = apiregistrationUrl;
        this.logger = logger;
    }

    public Collection<ApiRegistrationPublic> getPublished() {

        RestTemplate restTemplate = new RestTemplate();
        String publishedHalJson = restTemplate.getForObject(this.apiregistrationUrl + "/public/apis", String.class);
        logger.debug("String response from public apis \"{}\"...", publishedHalJson.substring(0, 20));

        JsonParser parser = new JsonParser();
        JsonElement rootElement = parser.parse(publishedHalJson);

        JsonElement apiRegistrationPublicsJson = rootElement
            .getAsJsonObject().get("_embedded")
            .getAsJsonObject().get("apiRegistrationPublics");

        Gson gson = new Gson();
        TypeToken<List<ApiRegistrationPublic>> token = new TypeToken<List<ApiRegistrationPublic>>() {
        };

        List<ApiRegistrationPublic> apiRegistrations = gson.fromJson(apiRegistrationPublicsJson, token.getType());

        logger.debug("Converted list of public apis: {}", apiRegistrations.size());

        return apiRegistrations;
    }
}
