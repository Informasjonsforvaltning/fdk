package no.dcat.model;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.fdk.acat.bindings.ApiCatBindings;
import no.fdk.acat.common.model.ApiEditableProperties;
import org.apache.commons.lang.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static no.dcat.model.ApiRegistration.REGISTRATION_STATUS_DRAFT;

public class ApiRegistrationBuilder {
    private ApiRegistration apiRegistration;

    public ApiRegistrationBuilder(String catalogId) {
        apiRegistration = new ApiRegistration();
        apiRegistration.setId(UUID.randomUUID().toString());
        apiRegistration.setCatalogId(catalogId);
        apiRegistration.setRegistrationStatus(REGISTRATION_STATUS_DRAFT);
    }

    public ApiRegistrationBuilder(ApiRegistration apiRegistration) {
        this.apiRegistration = apiRegistration;
    }

    static Set<String> getEditablePropertyNames() {
        return Arrays.stream(ApiEditableProperties.class.getDeclaredFields()).map(f -> f.getName()).collect(Collectors.toSet());

    }

    public ApiRegistration build() {
        apiRegistration.set_lastModified(new Date());
        return apiRegistration;
    }

    public ApiRegistrationBuilder setFromApiCatalog(boolean fromApiCatalog) {
        apiRegistration.setFromApiCatalog(fromApiCatalog);
        return this;
    }

    public ApiRegistrationBuilder setHarvestStatus(HarvestStatus harvestStatus) {
        apiRegistration.setHarvestStatus(harvestStatus);
        return this;
    }

    public ApiRegistrationBuilder setApiSpecificationFromSpec(String apiSpec, ApiCatBindings apiCatService) {
        // if we parse from spec, then remove potentially conflicting spec url input
        apiRegistration.setApiSpecification(apiCatService.convertSpecToApiSpecification(apiSpec));
        apiRegistration.setApiSpecUrl(null);
        apiRegistration.setApiSpec(apiSpec);
        return this;
    }

    public ApiRegistrationBuilder setApiSpecificationFromSpecUrl(String apiSpecUrl, ApiCatBindings apiCatService) {
        // if we parse from from spec url, then remove potentially conflicting spec input
        apiRegistration.setApiSpecification(apiCatService.convertSpecUrlToApiSpecification(apiSpecUrl));
        apiRegistration.setApiSpecUrl(apiSpecUrl);
        apiRegistration.setApiSpec(null);
        return this;
    }

    public ApiRegistrationBuilder setData(Map<String, Object> data, ApiCatBindings apiCatService) {

        setEditableProperties(data);

        String apiSpecUrl = (String) data.get("apiSpecUrl");
        String apiSpec = (String) data.get("apiSpec");

        if (StringUtils.isNotEmpty(apiSpecUrl)) {
            setApiSpecificationFromSpecUrl(apiSpecUrl, apiCatService);
        } else if (!StringUtils.isEmpty(apiSpec)) {
            setApiSpecificationFromSpec(apiSpec, apiCatService);
        }

        return this;
    }

    public ApiRegistrationBuilder setEditableProperties(Map<String, Object> data) {
        Gson gson = new Gson();

        Set<String> editablePropertyNames = getEditablePropertyNames();
        JsonObject apiRegistrationJson = gson.toJsonTree(apiRegistration).getAsJsonObject();

        data.entrySet().stream()
            .filter(entry -> editablePropertyNames.contains(entry.getKey()))
            .forEach(entry -> {
                JsonElement jsonValue = gson.toJsonTree(entry.getValue());
                // Despite confusing name, JsonObject.add actually replaces field value
                apiRegistrationJson.add(entry.getKey(), jsonValue);
            });

        apiRegistration = gson.fromJson(apiRegistrationJson, ApiRegistration.class);
        return this;
    }
}
