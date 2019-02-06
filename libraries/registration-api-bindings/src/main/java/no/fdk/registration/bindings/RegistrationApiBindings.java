package no.fdk.registration.bindings;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import lombok.Getter;
import lombok.Setter;
import no.fdk.registration.common.ApiRegistrationPublic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/*
RegistrationApiBindings is a library for consuming REST api with strong types.
 */
public class RegistrationApiBindings {
    @Getter
    @Setter
    private String apiRootUrl;

    private static Logger logger = LoggerFactory.getLogger(RegistrationApiBindings.class);

    public List<ApiRegistrationPublic> getPublished() {
        List<ApiRegistrationPublic> result = new ArrayList<>();

        try {
            RestTemplate restTemplate = new RestTemplate();
            String publishedHalJson = restTemplate.getForObject(getPublicApisUrlBase(), String.class);
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

            logger.debug("Converted {} public apis", apiRegistrations.size());

            result.addAll(apiRegistrations);

        } catch (Exception e) {
            logger.info("Error. Cannot read published apis from registration. {}", e.getMessage());
            logger.debug("Error. Stack trace", e);
            return null;
        }

        return result;
    }

    public String getPublicApisUrlBase() {
        return getApiRootUrl() + "/registration/apis";
    }
}
