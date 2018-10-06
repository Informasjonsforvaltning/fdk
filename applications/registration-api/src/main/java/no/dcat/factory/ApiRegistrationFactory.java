package no.dcat.factory;

import no.dcat.model.ApiRegistration;

import java.util.Date;
import java.util.UUID;

public class ApiRegistrationFactory {

    public static ApiRegistration createApiRegistration(String catalogId, ApiRegistration data) {
        return data.toBuilder()
                .id(UUID.randomUUID().toString())
                .catalogId(catalogId)
                .registrationStatus(ApiRegistration.REGISTRATION_STATUS_DRAFT)
                ._lastModified(new Date())
                .build();
    }
}
