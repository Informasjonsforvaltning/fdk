package no.dcat.model;

import org.springframework.beans.BeanUtils;

import java.util.Date;
import java.util.UUID;

public class ApiRegistrationFactory {

    public static ApiRegistration createApiRegistration(String catalogId, ApiRegistration data) {

        ApiRegistration apiRegistration = new ApiRegistration();

        BeanUtils.copyProperties(data, apiRegistration);

        apiRegistration.setId(UUID.randomUUID().toString());
        apiRegistration.setCatalogId(catalogId);
        apiRegistration.setRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_DRAFT);
        apiRegistration.set_lastModified(new Date());

        return apiRegistration;

    }
}
