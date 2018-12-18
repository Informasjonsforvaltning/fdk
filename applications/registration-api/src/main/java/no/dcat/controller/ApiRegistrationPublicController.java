package no.dcat.controller;

import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.config.BasicAuthConfig;
import no.dcat.model.ApiHarvestStatus;
import no.dcat.model.ApiRegistration;
import no.dcat.service.ApiRegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/*
* The controller for public apis provided by the registration service.
* Authentication and authorization is disabled.
* Public endpoints are used for example as a sourcing the public search service.
*/
@RestController
@RequestMapping(value = "/public")
public class ApiRegistrationPublicController {

    private static final Logger logger = LoggerFactory.getLogger(ApiRegistrationPublicController.class);

    private ApiRegistrationRepository apiRegistrationRepository;

    @Autowired
    public ApiRegistrationPublicController(
        ApiRegistrationRepository apiRegistrationRepository
    ) {
        this.apiRegistrationRepository = apiRegistrationRepository;
    }

    /**
     * Get all published api registration
     *
     * @return complete apiRegistration
     */
    @CrossOrigin
    @RequestMapping(
        value = "/apis",
        method = GET,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<ApiRegistrationPublic> getPublished(Pageable pageable, PagedResourcesAssembler assembler) {
        logger.info("Get the stuffs!");

        Page<ApiRegistration> apiRegistrationsPagePage =
            apiRegistrationRepository.findByRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH, pageable);

        logger.info("Total elems published" + apiRegistrationsPagePage.getTotalElements());
        ApiHarvestStatus hStatus =  new ApiHarvestStatus();
        hStatus.success = true;

        Page<ApiRegistration> apiRegistrationsPage =
            apiRegistrationRepository.findByRegistrationStatusAndIsFromApiCatalogAndHarvestStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH, true, hStatus, pageable );

        logger.info("Total elems published & success " + apiRegistrationsPage.getTotalElements());
        List<ApiRegistration> apiRegistrationList = apiRegistrationsPage.getContent();
        List<ApiRegistrationPublic> apiRegistrationPublicList = apiRegistrationList.stream()
            .map(this::convert)
            .collect(Collectors.toList());

        Page<ApiRegistrationPublic> apiRegistrationPublicsPage = new PageImpl<>(apiRegistrationPublicList, pageable, apiRegistrationPublicList.size());

        return assembler.toResource(apiRegistrationPublicsPage);
    }

    private ApiRegistrationPublic convert(ApiRegistration r) {
        ApiRegistrationPublic pub = new ApiRegistrationPublic();
        BeanUtils.copyProperties(r, pub);
        return pub;
    }

}
