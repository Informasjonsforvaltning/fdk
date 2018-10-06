package no.dcat.controller;

import no.dcat.factory.ApiRegistrationFactory;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs/{catalogId}/apis")
public class ApiRegistrationController {

    private static Logger logger = LoggerFactory.getLogger(ApiRegistrationController.class);

    private ApiRegistrationRepository apiRegistrationRepository;
    private CatalogRepository catalogRepository;

    @Autowired
    public ApiRegistrationController(
            ApiRegistrationRepository apiRegistrationRepository, CatalogRepository catalogRepository) {
        this.apiRegistrationRepository = apiRegistrationRepository;
        this.catalogRepository = catalogRepository;
    }

    /**
     * Return list of all apiRegistrations in catalog.
     *
     * @param catalogId    the id of the catalog
     * @param pageable
     * @return List of api registrations
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<ApiRegistration> listApiRegistrations(
            @PathVariable("catalogId") String catalogId,
            Pageable pageable,
            PagedResourcesAssembler assembler
    ) {
        Page<ApiRegistration> apiRegistrations = apiRegistrationRepository.findByCatalogId(catalogId, pageable);

        return assembler.toResource(apiRegistrations);
    }

    /**
     * Get apiRegistration by Id
     *
     * @param id Identifier of apiRegistration
     * @return complete apiRegistration
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration getApiRegistration(
            @PathVariable("catalogId") String catalogId,
            @PathVariable("id") String id
    ) throws NotFoundException {
        Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);

        if (!apiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = apiRegistrationOptional.get();

        if (!Objects.equals(catalogId, apiRegistration.getCatalogId())) {
            throw new NotFoundException();
        }

        return apiRegistration;
    }

    /**
     * Create new apiRegistration in catalog. Id for the apiRegistration is created automatically.
     *
     * @param apiRegistrationData
     * @return ApiRegistration
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(
            value = "",
            method = POST,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration createApiRegistration(
            @PathVariable("catalogId") String catalogId,
            @RequestBody ApiRegistration apiRegistrationData
    ) throws NotFoundException {

        logger.info("SAVE requestbody apiRegistration");

        Optional<Catalog> catalogOptional = catalogRepository.findById(catalogId);

        if (!catalogOptional.isPresent()) {
            // This can happen if authorization system has catalogId, but we don't have it in our system
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = ApiRegistrationFactory.createApiRegistration(catalogId, apiRegistrationData);

        logger.debug("create apiRegistration {}", apiRegistration.getId());

        return apiRegistrationRepository.save(apiRegistration);
    }

    /**
     * Delete apiRegistration
     *
     * @param id Identifier of apiRegistration
     * @return HTTP status 204 NO CONTENT is returned if apiRegistration was successfully deleted. If
     * apiRegistration is not found, HTTP 404 Not found is returned
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteApiRegistration(
            @PathVariable("catalogId") String catalogId,
            @PathVariable("id") String id
    ) throws NotFoundException {
        logger.info("DELETE apiRegistration: " + id);

        Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);


        if (!apiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = apiRegistrationOptional.get();

        if (!Objects.equals(catalogId, apiRegistration.getCatalogId())) {
            throw new NotFoundException();
        }
        apiRegistrationRepository.delete(apiRegistration);
    }
}
