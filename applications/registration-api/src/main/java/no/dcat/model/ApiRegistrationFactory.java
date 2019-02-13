package no.dcat.model;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.dcat.service.ApiCatService;
import no.fdk.acat.bindings.ApiCatBindings;
import no.fdk.registration.common.ApiRegistrationEditableProperties;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import static no.fdk.registration.common.ApiRegistrationEditableProperties.REGISTRATION_STATUS_DRAFT;

@Component
public class ApiRegistrationFactory {
    private ApiCatBindings apiCat;

    @Autowired
    public ApiRegistrationFactory(ApiCatService apiCatService) {
        this.apiCat = apiCatService;
    }

    public ApiRegistration createApiRegistration(String catalogId) {

        ApiRegistration apiRegistration = new ApiRegistration();

        apiRegistration.setId(UUID.randomUUID().toString());
        apiRegistration.setCatalogId(catalogId);
        apiRegistration.setRegistrationStatus(REGISTRATION_STATUS_DRAFT);
        apiRegistration.set_lastModified(new Date());

        return apiRegistration;

    }

    public void setApiSpecificationFromSpec(ApiRegistration apiRegistration, String apiSpec) {
        // if we parse from spec, then remove potentially conflicting spec url input
        apiRegistration.setApiSpecification(apiCat.convertSpecToApiSpecification(apiSpec));
        apiRegistration.setApiSpecUrl(null);
        apiRegistration.setApiSpec(apiSpec);
    }

    public void setApiSpecificationFromSpecUrl(ApiRegistration apiRegistration, String apiSpecUrl) {
        // if we parse from from spec url, then remove potentially conflicting spec input
        apiRegistration.setApiSpecification(apiCat.convertSpecUrlToApiSpecification(apiSpecUrl));
        apiRegistration.setApiSpecUrl(apiSpecUrl);
        apiRegistration.setApiSpec(null);
    }

    public void copyEditableProperties(ApiRegistration apiRegistration, Map<String, Object> updates) {
        Gson gson = new Gson();

        Set<String> editableFieldNames = Arrays.stream(ApiRegistrationEditableProperties.class.getDeclaredFields()).map(f -> f.getName()).collect(Collectors.toSet());

        JsonObject apiRegistrationJson = gson.toJsonTree(apiRegistration).getAsJsonObject();

        updates.entrySet().stream()
            .filter(entry -> editableFieldNames.contains(entry.getKey()))
            .forEach(entry -> {
                JsonElement jsonValue = gson.toJsonTree(entry.getValue());
                apiRegistrationJson.add(entry.getKey(), jsonValue); // JsonObject.add actually replaces value
            });

        ApiRegistration editedApiRegistration = gson.fromJson(apiRegistrationJson, ApiRegistration.class);

        // copy all properties back to original object, including the edited ones
        BeanUtils.copyProperties(editedApiRegistration, apiRegistration);

        String apiSpecUrl = (String) updates.get("apiSpecUrl");
        String apiSpec = (String) updates.get("apiSpec");

        if (!StringUtils.isEmpty(apiSpecUrl)) {
            setApiSpecificationFromSpecUrl(apiRegistration, apiSpecUrl);
        } else if (!StringUtils.isEmpty(apiSpec)) {
            setApiSpecificationFromSpec(apiRegistration, apiSpec);
        }

        apiRegistration.set_lastModified(new Date());
    }
}
