package no.dcat.factory;

import no.dcat.model.ApiRegistration;
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

    public static ApiRegistration updateApiRegistration(ApiRegistration oldApiRegistration, ApiRegistration data) {

        ApiRegistration newApiRegistration = new ApiRegistration();


        BeanUtils.copyProperties(data, newApiRegistration);

        newApiRegistration.setId(oldApiRegistration.getId());
        newApiRegistration.setCatalogId(oldApiRegistration.getCatalogId());

        newApiRegistration.set_lastModified(new Date());

        return newApiRegistration;

    }

}
