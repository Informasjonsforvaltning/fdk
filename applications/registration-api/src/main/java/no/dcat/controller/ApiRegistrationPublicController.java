package no.dcat.controller;

import no.dcat.model.ApiRegistration;
import no.dcat.service.ApiRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

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
    public PagedResources<ApiRegistration> getPublished(Pageable pageable, PagedResourcesAssembler assembler) {

        Page<ApiRegistration> apiRegistrations =
            apiRegistrationRepository.findByRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_PUBLISH, pageable);

        return assembler.toResource(apiRegistrations);
    }

}
