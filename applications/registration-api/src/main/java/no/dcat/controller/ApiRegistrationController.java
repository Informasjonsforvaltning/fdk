package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.swagger.v3.oas.models.OpenAPI;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.factory.ApiRegistrationFactory;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.service.ApiCatService;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import no.dcat.webutils.exceptions.BadRequestException;
import no.dcat.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;
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
    private ApiCatClient apiCatClient;

    @Autowired
    public ApiRegistrationController(
        ApiRegistrationRepository apiRegistrationRepository,
        CatalogRepository catalogRepository,
        ApiCatService apiCatService
    ) {
        this.apiRegistrationRepository = apiRegistrationRepository;
        this.catalogRepository = catalogRepository;
        this.apiCatClient = apiCatService.getClient();
    }

    /**
     * Return list of all apiRegistrations in catalog.
     *
     * @param catalogId the id of the catalog
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
    ) throws NotFoundException, BadRequestException {

        logger.info("SAVE requestbody apiRegistration");

        Optional<Catalog> catalogOptional = catalogRepository.findById(catalogId);

        if (!catalogOptional.isPresent()) {
            // This can happen if authorization system has catalogId, but we don't have it in our system
            throw new NotFoundException();
        }

        try {
            String apiSpecUrl = apiRegistrationData.getApiSpecUrl();
            String apiSpec = apiRegistrationData.getApiSpec();
            OpenAPI openAPI = apiCatClient.convert(apiSpecUrl, apiSpec);
            apiRegistrationData.setOpenApi(openAPI);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        ApiRegistration apiRegistration = ApiRegistrationFactory.createApiRegistration(catalogId, apiRegistrationData);

        logger.debug("create apiRegistration {}", apiRegistration.getId());

        ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);

        apiCatClient.triggerHarvestApiRegistration(savedApiRegistration.getId());

        return savedApiRegistration;
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
    ) throws NotFoundException, BadRequestException {
        logger.info("DELETE apiRegistration: " + id);

        Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);


        if (!apiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = apiRegistrationOptional.get();

        if (!Objects.equals(catalogId, apiRegistration.getCatalogId())) {
            throw new NotFoundException();
        }

        if (apiRegistration.getRegistrationStatus().equals(ApiRegistration.REGISTRATION_STATUS_PUBLISH)) {
            throw new BadRequestException();
        }

        apiRegistrationRepository.delete(apiRegistration);

        apiCatClient.triggerHarvestApiRegistration(id);
    }

    /**
     * Modify apiRegistration in catalog.
     *
     * @param updates Objects in apiRegistration to be updated
     * @return apiRegistration
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(
        value = "/{id}",
        method = PATCH,
        consumes = APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration patchApiRegistration(
        @PathVariable("catalogId") String catalogId,
        @PathVariable("id") String id,
        @RequestBody Map<String, Object> updates)
        throws NotFoundException {
        logger.info("PATCH requestbody update apiRegistration: {}", updates.toString());

        Gson gson = new Gson();

        // get already saved apiRegistration
        Optional<ApiRegistration> oldApiRegistrationOptional = apiRegistrationRepository.findById(id);
        if (!oldApiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration oldApiRegistration = oldApiRegistrationOptional.get();

        if (!Objects.equals(catalogId, oldApiRegistration.getCatalogId())) {
            throw new NotFoundException();
        }

        JsonObject oldApiRegistrationJson = gson.toJsonTree(oldApiRegistration).getAsJsonObject();

        updates.forEach((key, newValue) -> {
            logger.debug("update key: {} value: ", key, newValue);
            JsonElement jsonValue = gson.toJsonTree(newValue);
            oldApiRegistrationJson.add(key, jsonValue); // JsonObject.add actually replaces value
        });

        logger.debug("Changed apiRegistration Json element: {}", oldApiRegistrationJson.toString());

        ApiRegistration newApiRegistration =
            gson.fromJson(oldApiRegistrationJson.toString(), ApiRegistration.class);
        newApiRegistration.set_lastModified(new Date());

        ApiRegistration savedApiRegistration = apiRegistrationRepository.save(newApiRegistration);

        apiCatClient.triggerHarvestApiRegistration(id);

        return savedApiRegistration;
    }
}
