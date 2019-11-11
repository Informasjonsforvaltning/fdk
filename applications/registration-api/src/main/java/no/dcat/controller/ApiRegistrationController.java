package no.dcat.controller;

import no.dcat.model.ApiRegistration;
import no.dcat.model.ApiRegistrationBuilder;
import no.dcat.service.ApiCatService;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.service.InformationmodelCatService;
import no.fdk.acat.bindings.ApiCatBindings;
import no.fdk.imcat.bindings.InformationmodelCatBindings;
import no.fdk.webutils.exceptions.BadRequestException;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static no.dcat.model.ApiRegistration.REGISTRATION_STATUS_PUBLISH;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs/{catalogId}/apis")
public class ApiRegistrationController {

    private static Logger logger = LoggerFactory.getLogger(ApiRegistrationController.class);

    private ApiRegistrationRepository apiRegistrationRepository;
    private CatalogRepository catalogRepository;
    private ApiCatBindings apiCat;
    private InformationmodelCatBindings informationmodelCat;

    @Autowired
    public ApiRegistrationController(
        ApiRegistrationRepository apiRegistrationRepository,
        CatalogRepository catalogRepository,
        ApiCatService apiCatService,
        InformationmodelCatService informationmodelCatService
    ) {
        this.apiRegistrationRepository = apiRegistrationRepository;
        this.catalogRepository = catalogRepository;
        this.apiCat = apiCatService;
        this.informationmodelCat = informationmodelCatService;
    }

    /**
     * Return list of all apiRegistrations in catalog.
     *
     * @param catalogId the id of the catalog
     * @param pageable
     * @return List of api registrations
     */
    @PreAuthorize("hasPermission(#catalogId, 'organization', 'read')")
    @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<Resource<ApiRegistration>> listApiRegistrations(
        @PathVariable("catalogId") String catalogId,
        Pageable pageable,
        PagedResourcesAssembler<ApiRegistration> assembler
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
    @PreAuthorize("hasPermission(#catalogId, 'organization', 'read')")
    @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration getApiRegistration(
        @PathVariable("catalogId") String catalogId,
        @PathVariable("id") String id
    ) throws NotFoundException {
        return getApiRegistrationByIdAndCatalogId(id, catalogId);
    }

    /**
     * Create new apiRegistration in catalog. Id for the apiRegistration is created automatically.
     *
     * @param data
     * @return ApiRegistration
     */
    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @RequestMapping(
        value = "",
        method = POST,
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration createApiRegistration(
        @PathVariable("catalogId") String catalogId,
        @RequestBody Map<String, Object> data
    ) throws NotFoundException, BadRequestException {

        logger.info("SAVE requestbody apiRegistration");

        catalogRepository.findById(catalogId).orElseThrow(NotFoundException::new);

        ApiRegistration apiRegistration;
        try {
            apiRegistration = new ApiRegistrationBuilder(catalogId)
                .setData(data, apiCat)
                .build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
        logger.debug("create apiRegistration {}", apiRegistration.getId());
        ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);

        apiCat.triggerHarvestApiRegistration(savedApiRegistration.getId());
        informationmodelCat.triggerHarvestApiRegistration(savedApiRegistration.getId());

        return savedApiRegistration;
    }

    /**
     * Delete apiRegistration
     *
     * @param id Identifier of apiRegistration
     * @return HTTP status 204 NO CONTENT is returned if apiRegistration was successfully deleted. If
     * apiRegistration is not found, HTTP 404 Not found is returned
     */
    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteApiRegistration(
        @PathVariable("catalogId") String catalogId,
        @PathVariable("id") String id
    ) throws NotFoundException, BadRequestException {
        logger.info("DELETE apiRegistration: " + id);

        ApiRegistration apiRegistration = getApiRegistrationByIdAndCatalogId(id, catalogId);

        if (apiRegistration.getRegistrationStatus().equals(REGISTRATION_STATUS_PUBLISH)) {
            throw new BadRequestException();
        }

        apiRegistrationRepository.delete(apiRegistration);

        apiCat.triggerHarvestApiRegistration(id);
        informationmodelCat.triggerHarvestApiRegistration(id);
    }

    /**
     * Modify apiRegistration in catalog.
     *
     * @param updates Objects in apiRegistration to be updated
     * @return apiRegistration
     */
    @PreAuthorize("hasPermission(#catalogId, 'organization', 'write')")
    @RequestMapping(
        value = "/{id}",
        method = PATCH,
        consumes = APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration patchApiRegistration(
        @PathVariable("catalogId") String catalogId,
        @PathVariable("id") String id,
        @RequestBody Map<String, Object> updates)
        throws NotFoundException, BadRequestException {
        logger.info("PATCH requestbody update apiRegistration: {}", updates.toString());

        ApiRegistration oldApiRegistration = getApiRegistrationByIdAndCatalogId(id, catalogId);

        ApiRegistration apiRegistration;
        try {
            apiRegistration = new ApiRegistrationBuilder(oldApiRegistration)
                .setData(updates, apiCat)
                .build();

        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);

        apiCat.triggerHarvestApiRegistration(id);
        informationmodelCat.triggerHarvestApiRegistration(id);


        return savedApiRegistration;
    }

    ApiRegistration getApiRegistrationByIdAndCatalogId(String id, String catalogId) throws NotFoundException {
        return apiRegistrationRepository
            .findById(id)
            .filter(r -> catalogId.equals(r.getCatalogId()))
            .orElseThrow(NotFoundException::new);
    }
}
