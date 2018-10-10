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
@RequestMapping(value = "/catalogs/{orgNr}/apis")
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
     * @param orgNr    the id of the catalog
     * @param pageable
     * @return List of api registrations
     */
    @PreAuthorize("hasPermission(#orgNr, 'write')")
    @CrossOrigin
    @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<ApiRegistration> listApiRegistrations(
            @PathVariable("orgNr") String orgNr,
            Pageable pageable,
            PagedResourcesAssembler assembler
    ) {
        Page<ApiRegistration> apiRegistrations = apiRegistrationRepository.findByOrgNr(orgNr, pageable);

        return assembler.toResource(apiRegistrations);
    }

    /**
     * Get apiRegistration by Id
     *
     * @param id Identifier of apiRegistration
     * @return complete apiRegistration
     */
    @PreAuthorize("hasPermission(#orgNr, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration getApiRegistration(
            @PathVariable("orgNr") String orgNr,
            @PathVariable("id") String id
    ) throws NotFoundException {
        Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);

        if (!apiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = apiRegistrationOptional.get();

        if (!Objects.equals(orgNr, apiRegistration.getOrgNr())) {
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
    @PreAuthorize("hasPermission(#orgNr, 'write')")
    @CrossOrigin
    @RequestMapping(
            value = "",
            method = POST,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration createApiRegistration(
            @PathVariable("orgNr") String orgNr,
            @RequestBody ApiRegistration apiRegistrationData
    ) throws NotFoundException, BadRequestException {

        logger.info("SAVE requestbody apiRegistration");

        Optional<Catalog> catalogOptional = catalogRepository.findById(orgNr);

        if (!catalogOptional.isPresent()) {
            // This can happen if authorization system has orgNr, but we don't have it in our system
            throw new NotFoundException();
        }

        try {
            String apiSpecUrl = apiRegistrationData.getApiSpecUrl();
            String apiSpec = apiRegistrationData.getApiSpec();
            OpenAPI openAPI = this.apiCatClient.convert(apiSpecUrl, apiSpec);
            apiRegistrationData.setOpenApi(openAPI);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        ApiRegistration apiRegistration = ApiRegistrationFactory.createApiRegistration(orgNr, apiRegistrationData);

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
    @PreAuthorize("hasPermission(#orgNr, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteApiRegistration(
            @PathVariable("orgNr") String orgNr,
            @PathVariable("id") String id
    ) throws NotFoundException {
        logger.info("DELETE  apiRegistration: " + id);

        Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);


        if (!apiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration apiRegistration = apiRegistrationOptional.get();

        if (!Objects.equals(orgNr, apiRegistration.getOrgNr())) {
            throw new NotFoundException();
        }
        apiRegistrationRepository.delete(apiRegistration);
    }

    /**
     * Modify apiRegistration in catalog.
     *
     * @param updates Objects in apiRegistration to be updated
     * @return apiRegistration
     */
    @PreAuthorize("hasPermission(#orgNr, 'write')")
    @CrossOrigin
    @RequestMapping(
            value = "/{id}",
            method = PATCH,
            consumes = APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ApiRegistration patchApiRegistration(
            @PathVariable("orgNr") String orgNr,
            @PathVariable("id") String id,
            @RequestBody Map<String, Object> updates)
            throws NotFoundException {
        logger.info("PATCH requestbody update apiRegistration: " + updates.toString());

        Gson gson = new Gson();

        // get already saved apiRegistration
        Optional<ApiRegistration> oldApiRegistrationOptional = apiRegistrationRepository.findById(id);
        if (!oldApiRegistrationOptional.isPresent()) {
            throw new NotFoundException();
        }

        ApiRegistration oldApiRegistration = oldApiRegistrationOptional.get();

        if (!Objects.equals(orgNr, oldApiRegistration.getOrgNr())) {
            throw new NotFoundException();
        }

        JsonObject oldApiRegistrationJson = gson.toJsonTree(oldApiRegistration).getAsJsonObject();

        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            logger.debug("update key: {} value: ", entry.getKey(), entry.getValue());
            JsonElement changes = gson.toJsonTree(entry.getValue());
            if (oldApiRegistrationJson.has(entry.getKey())) {
                oldApiRegistrationJson.remove(entry.getKey());
            }
            oldApiRegistrationJson.add(entry.getKey(), changes);
        }

        logger.debug("Changed apiRegistration Json element: {}", oldApiRegistrationJson.toString());

        ApiRegistration newApiRegistration =
                gson.fromJson(oldApiRegistrationJson.toString(), ApiRegistration.class);
        newApiRegistration.setLastModified(new Date());

        ApiRegistration savedApiRegistration = apiRegistrationRepository.save(newApiRegistration);
        return savedApiRegistration;
    }
}
