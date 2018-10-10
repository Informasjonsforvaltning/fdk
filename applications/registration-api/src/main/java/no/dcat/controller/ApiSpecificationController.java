package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.ApiSpecification;
import no.dcat.model.Catalog;
import no.dcat.model.exceptions.ApispecNotFoundException;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.ErrorResponse;
import no.dcat.service.ApiSpecificationRepository;
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
@RequestMapping(value = "/catalogs/{catalogId}/apispecs")
public class ApiSpecificationController {

  private static Logger logger = LoggerFactory.getLogger(ApiSpecificationController.class);

  private ApiSpecificationRepository apiSpecificationRepository;
  private CatalogRepository catalogRepository;

  @Autowired
  public ApiSpecificationController(
      ApiSpecificationRepository apiSpecificationRepository, CatalogRepository catalogRepository) {
    this.apiSpecificationRepository = apiSpecificationRepository;
    this.catalogRepository = catalogRepository;
  }

  /**
   * Get complete apiSpecification
   *
   * @param id Identifier of apiSpecification
   * @return complete apiSpecification. HTTP status 200 OK is returned if apiSpecification is found.
   *     If apiSpecification is not found, HTTP 404 Not found is returned, with an empty body.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiSpecification> getApispec(
      @PathVariable("catalogId") String catalogId, @PathVariable("id") String id) {
    Optional<ApiSpecification> apiSpecificationOptional = apiSpecificationRepository.findById(id);

    ApiSpecification apiSpecification =
        apiSpecificationOptional.isPresent() ? apiSpecificationOptional.get() : null;

    if (apiSpecification == null || !Objects.equals(catalogId, apiSpecification.getCatalogId())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(apiSpecification, HttpStatus.OK);
  }

  /**
   * Return list of all apiSpecifications in catalog. Without parameters, the first 20
   * apiSpecifications are returned The returned data contains paging hyperlinks.
   *
   * <p>
   *
   * @param catalogId the id of the catalog
   * @param pageable number of apiSpecifications returned
   * @return List of data sets, with hyperlinks to other pages in search result
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<PagedResources<ApiSpecification>> listApiSpecifications(
      @PathVariable("catalogId") String catalogId,
      Pageable pageable,
      PagedResourcesAssembler assembler) {

    logger.info("Get apiSpecifications");

    Page<ApiSpecification> apiSpecifications =
        apiSpecificationRepository.findByCatalogId(catalogId, pageable);
    return new ResponseEntity<>(assembler.toResource(apiSpecifications), HttpStatus.OK);
  }

  /**
   * Create new apiSpecification in catalog. ID for the apiSpecification is created automatically.
   *
   * @param apiSpecification
   * @return HTTP 200 OK if apiSpecification could be could be created.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/",
      method = POST,
      consumes = APPLICATION_JSON_VALUE,
      produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiSpecification> saveApispec(
      @PathVariable("catalogId") String catalogId, @RequestBody ApiSpecification apiSpecification)
      throws CatalogNotFoundException {

    logger.info("SAVE requestbody apiSpecification");

    Optional<Catalog> catalogOptional = catalogRepository.findById(catalogId);

    if (!catalogOptional.isPresent()) {
      throw new CatalogNotFoundException(
          String.format(
              "Unable to create apiSpecification, catalog with id %s not found", catalogId));
    }

    ApiSpecification savedApispec =
        createAndSaveApispec(catalogId, apiSpecification, catalogOptional.get());

    return new ResponseEntity<>(savedApispec, HttpStatus.OK);
  }

  ApiSpecification createAndSaveApispec(
      String catalogId, ApiSpecification apiSpecification, Catalog catalog) {

    // Create new apiSpecification
    ApiSpecification apiSpecWithNewId = RegistrationFactory.createApiSpecification(catalogId);

    // force new id, uri and catalogId, to ensure saving
    apiSpecification.setId(apiSpecWithNewId.getId());

    apiSpecification.setCatalogId(apiSpecWithNewId.getCatalogId());

    // force publisher
    apiSpecification.setPublisher(catalog.getPublisher());

    apiSpecification.setRegistrationStatus(ApiSpecification.REGISTRATION_STATUS_DRAFT);

    // Store metainformation about editing
    logger.debug(
        "create apiSpecification {} at timestamp {}",
        apiSpecification.getId(),
        Calendar.getInstance().getTime());
    apiSpecification.set_lastModified(Calendar.getInstance().getTime());

    return save(apiSpecification);
  }

  ApiSpecification save(ApiSpecification apispec) {
    return apiSpecificationRepository.save(apispec);
  }

  @ExceptionHandler(ApispecNotFoundException.class)
  public ResponseEntity<ErrorResponse> exceptionHandler(Exception ex) {
    ErrorResponse error = new ErrorResponse();
    error.setErrorCode(HttpStatus.NOT_FOUND.value());
    error.setMessage(ex.getMessage());

    return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
  }

  /**
   * Modify apiSpecification in catalog.
   *
   * @param apiSpecification
   * @return HTTP 200 OK if apiSpecification could be could be created.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/{id}",
      method = PUT,
      consumes = APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiSpecification> updateApiSpecificationPut(
      @PathVariable("catalogId") String catalogId,
      @PathVariable("id") String apiSpecificationId,
      @RequestBody ApiSpecification apiSpecification) {

    logger.info("PUT requestbody apiSpecification: " + apiSpecification.toString());
    apiSpecification.setId(apiSpecificationId);
    apiSpecification.setCatalogId(catalogId);

    if (!apiSpecificationRepository.findById(apiSpecification.getId()).isPresent()) {
      return ResponseEntity.notFound().build();
    }

    // Add metainformation about editing
    apiSpecification.set_lastModified(Calendar.getInstance().getTime());

    ApiSpecification savedApispec = apiSpecificationRepository.save(apiSpecification);
    return new ResponseEntity<>(savedApispec, HttpStatus.OK);
  }

  /**
   * Modify apiSpecification in catalog.
   *
   * @param updates Objects in apiSpecification to be updated
   * @return HTTP 200 OK if apiSpecification could be could be updated.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(
      value = "/{id}",
      method = PATCH,
      consumes = APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiSpecification> updateApiSpecificationPatch(
      @PathVariable("catalogId") String catalogId,
      @PathVariable("id") String apiSpecificationId,
      @RequestBody Map<String, Object> updates) {
    logger.info("PATCH requestbody update apiSpecification: " + updates.toString());

    Gson gson = new Gson();

    // get already saved apiSpecification
    Optional<ApiSpecification> oldApiSpecificationOptional =
        apiSpecificationRepository.findById(apiSpecificationId);
    ApiSpecification oldApiSpecification =
        oldApiSpecificationOptional.isPresent() ? oldApiSpecificationOptional.get() : null;

    if (oldApiSpecification == null
        || !Objects.equals(catalogId, oldApiSpecification.getCatalogId())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    logger.info("found old oldApiSpecification: {}" + oldApiSpecification.getTitle().get("nb"));

    JsonObject oldApiSpecificationtJson = gson.toJsonTree(oldApiSpecification).getAsJsonObject();

    for (Map.Entry<String, Object> entry : updates.entrySet()) {
      logger.debug("update key: {} value: ", entry.getKey(), entry.getValue());
      JsonElement changes = gson.toJsonTree(entry.getValue());
      if (oldApiSpecificationtJson.has(entry.getKey())) {
        oldApiSpecificationtJson.remove(entry.getKey());
      }
      oldApiSpecificationtJson.add(entry.getKey(), changes);
    }

    logger.debug("Changed apiSpecification Json element: {}", oldApiSpecificationtJson.toString());

    ApiSpecification newApiSpecification =
        gson.fromJson(oldApiSpecificationtJson.toString(), ApiSpecification.class);
    newApiSpecification.set_lastModified(Calendar.getInstance().getTime());

    ApiSpecification savedApiSpecification = apiSpecificationRepository.save(newApiSpecification);
    return new ResponseEntity<>(savedApiSpecification, HttpStatus.OK);
  }

  /**
   * Delete apiSpecification
   *
   * @param id Identifier of apiSpecification
   * @return HTTP status 200 OK is returned if apiSpecification was successfully deleted. Body
   *     empty. If apiSpecification is not found, HTTP 404 Not found is returned, with an empty
   *     body.
   */
  @PreAuthorize("hasPermission(#catalogId, 'write')")
  @CrossOrigin
  @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
  public HttpEntity<ApiSpecification> deleteApiSpecification(
      @PathVariable("catalogId") String catalogId, @PathVariable("id") String id) {
    logger.info("DELETE  apiSpecification: " + id);

    Optional<ApiSpecification> apiSpecificationOptional = apiSpecificationRepository.findById(id);
    ApiSpecification apiSpecification =
        apiSpecificationOptional.isPresent() ? apiSpecificationOptional.get() : null;

    if (apiSpecification == null || !Objects.equals(catalogId, apiSpecification.getCatalogId())) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    apiSpecificationRepository.delete(apiSpecification);

    return new ResponseEntity<>(HttpStatus.OK);
  }
}
