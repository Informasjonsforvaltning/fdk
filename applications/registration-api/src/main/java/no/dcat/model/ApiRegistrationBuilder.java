package no.dcat.model;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.fdk.acat.bindings.ApiCatBindings;
import no.fdk.acat.common.model.ApiEditableProperties;

import java.util.*;
import java.util.stream.Collectors;

import static no.dcat.model.ApiRegistration.REGISTRATION_STATUS_DRAFT;
import static no.dcat.model.ApiRegistration.REGISTRATION_STATUS_PUBLISH;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

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

    public ApiRegistrationBuilder setRegistrationStatus(String registrationStatus) {
        Set<String> registrationStatusCodes = new HashSet(Arrays.asList(REGISTRATION_STATUS_DRAFT, REGISTRATION_STATUS_PUBLISH));

        if (registrationStatusCodes.contains(registrationStatus)) {
            apiRegistration.setRegistrationStatus(registrationStatus);
        }

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

        if (isNotEmpty(apiSpecUrl)) {
            setApiSpecificationFromSpecUrl(apiSpecUrl, apiCatService);
        } else if (isNotEmpty(apiSpec)) {
            setApiSpecificationFromSpec(apiSpec, apiCatService);
        }

        String registrationStatus = (String) data.get("registrationStatus");
        if (isNotEmpty(registrationStatus)) {
            setRegistrationStatus(registrationStatus);
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

        fixStatusValues();

        return this;
    }

    public ApiRegistrationBuilder fixStatusValues() {
        // reset deprecation fields if not in one of deprecated statuses
        Set<String> deprecatedStatusCodes = new HashSet(Arrays.asList("DEPRECATED", "REMOVED"));

        if (!deprecatedStatusCodes.contains(apiRegistration.getStatusCode())) {
            apiRegistration.setDeprecationInfoExpirationDate(null);
            apiRegistration.setDeprecationInfoMessage(null);
            apiRegistration.setDeprecationInfoReplacedWithUrl(null);
        }

        return this;
    }
}
