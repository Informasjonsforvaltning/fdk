package no.fdk.imcat.bindings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.POST;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InformationmodelCatBindings {
    private static Logger logger = LoggerFactory.getLogger(InformationmodelCatBindings.class);

    private String apiRootUrl;

    private String getInformationmodelsApiRootUrl() {
        return getApiRootUrl() + "/informationmodels";
    }

    public void triggerHarvestApiRegistration(String apiRegistrationId) {
        String triggerUrl = getInformationmodelsApiRootUrl() + "/trigger/harvest/apiregistration/" + apiRegistrationId;
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.exchange(triggerUrl, POST, null, Void.class);
        } catch (Exception e) {
            String errorMessage = "Failed sending harvest trigger message " + triggerUrl;
            logger.error(errorMessage, e);
        }

    }
}

