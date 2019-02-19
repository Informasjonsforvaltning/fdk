package no.dcat.model;

import no.dcat.service.ApiCatService;
import no.fdk.acat.bindings.ApiCatBindings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

import static no.dcat.model.ApiRegistration.REGISTRATION_STATUS_DRAFT;

@Component
public class ApiRegistrationFactory {
    private ApiCatBindings apiCat;

    @Autowired
    public ApiRegistrationFactory(ApiCatService apiCatService) {
        this.apiCat = apiCatService;
    }

    public ApiRegistration createApiRegistration(String catalogId) {

        ApiRegistration apiRegistration = new ApiRegistration();

//        BeanUtils.copyProperties(data, apiRegistration);

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
}
