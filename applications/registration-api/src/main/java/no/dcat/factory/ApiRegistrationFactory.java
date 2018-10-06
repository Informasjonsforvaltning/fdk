package no.dcat.factory;

import no.dcat.model.ApiRegistration;

import java.util.Date;
import java.util.UUID;

public class ApiRegistrationFactory {

    public static ApiRegistration createApiRegistration(String orgNr, ApiRegistration data) {
        return data.toBuilder()
                .id(UUID.randomUUID().toString())
                .orgNr(orgNr)
                .registrationStatus(ApiRegistration.REGISTRATION_STATUS_DRAFT)
                .lastModified(new Date())
                .build();
    }
}
