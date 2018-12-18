package no.dcat.controller;

import no.dcat.client.registrationapi.ApiRegistrationPublic;
import no.dcat.model.ApiRegistration;
import no.dcat.service.ApiRegistrationRepository;
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

        Page<ApiRegistration> apiRegistrationsPage =
            apiRegistrationRepository.findByRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH, pageable);

        List<ApiRegistration> apiRegistrationList = apiRegistrationsPage.getContent();
        List<ApiRegistrationPublic> apiRegistrationPublicList = apiRegistrationList.stream()
            .filter(apiReg -> !apiReg.isFromApiCatalog() || apiReg.getHarvestStatus() != null && apiReg.getHarvestStatus().getSuccess())
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
