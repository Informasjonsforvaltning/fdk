package no.dcat.model;

import no.fdk.acat.bindings.ApiCatBindings;

import java.util.Date;
import java.util.UUID;

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
}
