package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Catalog;
import no.dcat.model.exceptions.ApispecNotFoundException;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.ErrorResponse;
import no.dcat.service.ApiRegistrationRepository;
import no.dcat.service.CatalogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs/{orgNr}/apispecs")
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
   * Get complete apiRegistration
   *
   * @param id Identifier of apiRegistration
   * @return complete apiRegistration. HTTP status 200 OK is returned if apiRegistration is found.
   *     If apiRegistration is not found, HTTP 404 Not found is returned, with an empty body.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiRegistration> getApispec(
      @PathVariable("orgNr") String orgNr, @PathVariable("id") String id) {
    Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);

    ApiRegistration apiRegistration =
        apiRegistrationOptional.isPresent() ? apiRegistrationOptional.get() : null;

    if (apiRegistration == null || !Objects.equals(orgNr, apiRegistration.getOrgNr())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(apiRegistration, HttpStatus.OK);
  }

  /**
   * Return list of all apiRegistrations in catalog. Without parameters, the first 20
   * apiRegistrations are returned The returned data contains paging hyperlinks.
   *
   * <p>
   *
   * @param orgNr the id of the catalog
   * @param pageable number of apiRegistrations returned
   * @return List of data sets, with hyperlinks to other pages in search result
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<PagedResources<ApiRegistration>> listApiRegistrations(
      @PathVariable("orgNr") String orgNr,
      Pageable pageable,
      PagedResourcesAssembler assembler) {

    logger.info("Get apiRegistrations");

    Page<ApiRegistration> apiRegistrations =
        apiRegistrationRepository.findByOrgNr(orgNr, pageable);
    return new ResponseEntity<>(assembler.toResource(apiRegistrations), HttpStatus.OK);
  }

  /**
   * Create new apiRegistration in catalog. ID for the apiRegistration is created automatically.
   *
   * @param apiRegistration
   * @return HTTP 200 OK if apiRegistration could be could be created.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/",
      method = POST,
      consumes = APPLICATION_JSON_VALUE,
      produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiRegistration> saveApispec(
      @PathVariable("orgNr") String orgNr, @RequestBody ApiRegistration apiRegistration)
      throws CatalogNotFoundException {

    logger.info("SAVE requestbody apiRegistration");

    Optional<Catalog> catalogOptional = catalogRepository.findById(orgNr);

    if (!catalogOptional.isPresent()) {
      throw new CatalogNotFoundException(
          String.format(
              "Unable to create apiRegistration, catalog with id %s not found", orgNr));
    }

    ApiRegistration savedApispec =
        createAndSaveApispec(orgNr, apiRegistration, catalogOptional.get());

    return new ResponseEntity<>(savedApispec, HttpStatus.OK);
  }

  ApiRegistration createAndSaveApispec(
      String orgNr, ApiRegistration apiRegistration, Catalog catalog) {

    // Create new apiRegistration
    ApiRegistration apiSpecWithNewId = RegistrationFactory.createApiRegistration(orgNr);

    // force new id, uri and catalogId, to ensure saving
    apiRegistration.setId(apiSpecWithNewId.getId());

    apiRegistration.setOrgNr(apiSpecWithNewId.getOrgNr());

    // force publisher
    apiRegistration.setPublisher(catalog.getPublisher());

    apiRegistration.setRegistrationStatus(ApiRegistration.REGISTRATION_STATUS_DRAFT);

    // Store metainformation about editing
    logger.debug(
        "create apiRegistration {} at timestamp {}",
        apiRegistration.getId(),
        Calendar.getInstance().getTime());
    apiRegistration.setLastModified(Calendar.getInstance().getTime());

    return save(apiRegistration);
  }

  ApiRegistration save(ApiRegistration apispec) {
    return apiRegistrationRepository.save(apispec);
  }

  @ExceptionHandler(ApispecNotFoundException.class)
  public ResponseEntity<ErrorResponse> exceptionHandler(Exception ex) {
    ErrorResponse error = new ErrorResponse();
    error.setErrorCode(HttpStatus.NOT_FOUND.value());
    error.setMessage(ex.getMessage());

    return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
  }

  /**
   * Modify apiRegistration in catalog.
   *
   * @param apiRegistration
   * @return HTTP 200 OK if apiRegistration could be could be created.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/{id}",
      method = PUT,
      consumes = APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiRegistration> updateApiRegistrationPut(
      @PathVariable("orgNr") String orgNr,
      @PathVariable("id") String apiRegistrationId,
      @RequestBody ApiRegistration apiRegistration) {

    logger.info("PUT requestbody apiRegistration: " + apiRegistration.toString());
    apiRegistration.setId(apiRegistrationId);
    apiRegistration.setOrgNr(orgNr);

    if (!apiRegistrationRepository.findById(apiRegistration.getId()).isPresent()) {
      return ResponseEntity.notFound().build();
    }

    // Add metainformation about editing
    apiRegistration.setLastModified(Calendar.getInstance().getTime());

    ApiRegistration savedApispec = apiRegistrationRepository.save(apiRegistration);
    return new ResponseEntity<>(savedApispec, HttpStatus.OK);
  }

  /**
   * Modify apiRegistration in catalog.
   *
   * @param updates Objects in apiRegistration to be updated
   * @return HTTP 200 OK if apiRegistration could be could be updated.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/{id}",
      method = PATCH,
      consumes = APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiRegistration> updateApiRegistrationPatch(
      @PathVariable("orgNr") String orgNr,
      @PathVariable("id") String apiRegistrationId,
      @RequestBody Map<String, Object> updates) {
    logger.info("PATCH requestbody update apiRegistration: " + updates.toString());

    Gson gson = new Gson();

    // get already saved apiRegistration
    Optional<ApiRegistration> oldApiRegistrationOptional =
        apiRegistrationRepository.findById(apiRegistrationId);
    ApiRegistration oldApiRegistration =
        oldApiRegistrationOptional.isPresent() ? oldApiRegistrationOptional.get() : null;

    if (oldApiRegistration == null
        || !Objects.equals(orgNr, oldApiRegistration.getOrgNr())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    logger.info("found old oldApiRegistration: {}" + oldApiRegistration.getTitle().get("nb"));

    JsonObject oldApiRegistrationtJson = gson.toJsonTree(oldApiRegistration).getAsJsonObject();

    for (Map.Entry<String, Object> entry : updates.entrySet()) {
      logger.debug("update key: {} value: ", entry.getKey(), entry.getValue());
      JsonElement changes = gson.toJsonTree(entry.getValue());
      if (oldApiRegistrationtJson.has(entry.getKey())) {
        oldApiRegistrationtJson.remove(entry.getKey());
      }
      oldApiRegistrationtJson.add(entry.getKey(), changes);
    }

    logger.debug("Changed apiRegistration Json element: {}", oldApiRegistrationtJson.toString());

    ApiRegistration newApiRegistration =
        gson.fromJson(oldApiRegistrationtJson.toString(), ApiRegistration.class);
    newApiRegistration.setLastModified(Calendar.getInstance().getTime());

    ApiRegistration savedApiRegistration = apiRegistrationRepository.save(newApiRegistration);
    return new ResponseEntity<>(savedApiRegistration, HttpStatus.OK);
  }

  /**
   * Delete apiRegistration
   *
   * @param id Identifier of apiRegistration
   * @return HTTP status 200 OK is returned if apiRegistration was successfully deleted. Body
   *     empty. If apiRegistration is not found, HTTP 404 Not found is returned, with an empty
   *     body.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiRegistration> deleteApiRegistration(
      @PathVariable("orgNr") String orgNr, @PathVariable("id") String id) {
    logger.info("DELETE  apiRegistration: " + id);

    Optional<ApiRegistration> apiRegistrationOptional = apiRegistrationRepository.findById(id);
    ApiRegistration apiRegistration =
        apiRegistrationOptional.isPresent() ? apiRegistrationOptional.get() : null;

    if (apiRegistration == null || !Objects.equals(orgNr, apiRegistration.getOrgNr())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    apiRegistrationRepository.delete(apiRegistration);

    return new ResponseEntity<>(HttpStatus.OK);
  }
}
