package no.dcat.controller;

import no.dcat.client.registrationapi.ApiRegistrationPublic;
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

import java.util.ArrayList;
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

        Page<ApiRegistration> apiRegistrationsPagePage =
            apiRegistrationRepository.findByRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH, pageable);


        List<ApiRegistration> registrationsToFilter = apiRegistrationsPagePage.getContent();
        List<ApiRegistration> filteredRegistrations = new ArrayList<>();

        //All ApiRegistrations in this list are published, due to the filter in the query.
        for (ApiRegistration apiReg : registrationsToFilter) {
            if (!apiReg.isFromApiCatalog()) {
                filteredRegistrations.add(apiReg);
            } else {
                if (apiReg.getHarvestStatus() != null && apiReg.getHarvestStatus().getSuccess()) {
                    filteredRegistrations.add(apiReg);
                }
            }
        }

        //convert to public
        List<ApiRegistrationPublic> apiRegistrationFilteredPublicList = filteredRegistrations.stream()
            .map(this::convert)
            .collect(Collectors.toList());

        Page<ApiRegistrationPublic> apiRegistrationPublicsPage = new PageImpl<>(apiRegistrationFilteredPublicList, pageable, apiRegistrationFilteredPublicList.size());
        return assembler.toResource(apiRegistrationPublicsPage);
    }

    private ApiRegistrationPublic convert(ApiRegistration r) {
        ApiRegistrationPublic pub = new ApiRegistrationPublic();
        BeanUtils.copyProperties(r, pub);
        return pub;
    }

}
