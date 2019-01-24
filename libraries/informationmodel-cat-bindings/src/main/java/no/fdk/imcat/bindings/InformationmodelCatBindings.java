package no.fdk.imcat.bindings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.POST;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InformationmodelCatBindings {
    private String apiRootUrl;

    private String getApisApiRootUrl() {
        return getApiRootUrl() + "/informationmodels";
    }

    public void triggerHarvestApiRegistration(String apiRegistrationId) {
        RestTemplate restTemplate = new RestTemplate();

        restTemplate.exchange(getApisApiRootUrl() + "/trigger/harvest/apiregistration/" + apiRegistrationId, POST, null, Void.class);
    }
}

