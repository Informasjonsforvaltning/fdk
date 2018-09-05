package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.ErrorResponse;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Calendar;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@Controller
@RequestMapping("/catalogs/{catalogId}/datasets")
public class DatasetController {

    private static Logger logger = LoggerFactory.getLogger(DatasetController.class);

    private DatasetRepository datasetRepository;
    private CatalogRepository catalogRepository;

    @Autowired
    public DatasetController(DatasetRepository datasetRepository, CatalogRepository catalogRepository) {
        this.datasetRepository = datasetRepository;
        this.catalogRepository = catalogRepository;
    }

    /**
     * Get complete dataset
     * @param id Identifier of dataset
     * @return complete dataset. HTTP status 200 OK is returned if dataset is found.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> getDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String id) {
        Optional<Dataset> datasetOptional = datasetRepository.findById(id);
        Dataset dataset = datasetOptional.isPresent() ? datasetOptional.get() : null;

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalogId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dataset, HttpStatus.OK);
    }


    /**
     * Create new dataset in catalog. ID for the dataset is created automatically.
     * @param dataset
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/", method = POST, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> saveDataset(@PathVariable("catalogId") String catalogId, @RequestBody Dataset dataset) throws CatalogNotFoundException {

        Optional<Catalog> catalogOptional = catalogRepository.findById(catalogId);

        if (!catalogOptional.isPresent()) {
            throw new CatalogNotFoundException(String.format("Unable to create dataset, catalog with id %s not found", catalogId));
        }

        Dataset savedDataset = createAndSaveDataset(catalogId, dataset, catalogOptional.get());


        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }

    Dataset createAndSaveDataset(String catalogId, Dataset dataset, Catalog catalog) {

        // Create new dataset
        Dataset datasetWithNewId = RegistrationFactory.createDataset(catalogId);

        // force new id, uri and catalogId, to ensure saving
        dataset.setId(datasetWithNewId.getId());
        dataset.setUri(datasetWithNewId.getUri());
        dataset.setCatalogId(datasetWithNewId.getCatalogId());

        // force publisher
        dataset.setPublisher(catalog.getPublisher());

        dataset.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);

        //Store metainformation about editing
        logger.debug("create dataset {} at timestamp {}", dataset.getId(), Calendar.getInstance().getTime());
        dataset.set_lastModified(Calendar.getInstance().getTime());

        return save(dataset);
    }

    Dataset save(Dataset dataset) {
        return datasetRepository.save(dataset);
    }


    @ExceptionHandler(CatalogNotFoundException.class)
    public ResponseEntity<ErrorResponse> exceptionHandler(Exception ex) {
        ErrorResponse error = new ErrorResponse();
        error.setErrorCode(HttpStatus.NOT_FOUND.value());
        error.setMessage(ex.getMessage());

        return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
    }


    /**
     * Modify dataset in catalog.
     * @param dataset
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = PUT, consumes = APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> saveDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String datasetId, @RequestBody Dataset dataset) {
        logger.info("PUT requestbody dataset: " + dataset.toString());
        dataset.setId(datasetId);
        dataset.setCatalogId(catalogId);

        if(!datasetRepository.findById(dataset.getId()).isPresent()){
            return ResponseEntity.notFound().build();
        }

        //Add metainformation about editing
        dataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = datasetRepository.save(dataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }


    /**
     * Modify dataset in catalog.
     * @param updates Objects in datatset to be updated
     * @return HTTP 200 OK if dataset could be could be updated.
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = PATCH, consumes = APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> updateDataset(@PathVariable("catalogId") String catalogId,
                                             @PathVariable("id") String datasetId,
                                             @RequestBody Map<String, Object> updates) {
        logger.info("PATCH requestbody update dataset: " + updates.toString());

        Gson gson = new Gson();

        //get already saved dataset
        Optional<Dataset> oldDatasetOptional = datasetRepository.findById(datasetId);
        Dataset oldDataset = oldDatasetOptional.isPresent() ? oldDatasetOptional.get() : null;

        if (oldDataset == null || !Objects.equals(catalogId, oldDataset.getCatalogId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        logger.info("found old dataset: {}" + oldDataset.getTitle().get("nb"));

        JsonObject oldDatasetJson = gson.toJsonTree(oldDataset).getAsJsonObject();

        for(Map.Entry<String, Object> entry : updates.entrySet()) {
            logger.debug("update key: {} value: ", entry.getKey(), entry.getValue() );
            JsonElement changes = gson.toJsonTree(entry.getValue());
            if(oldDatasetJson.has(entry.getKey())) {
                oldDatasetJson.remove(entry.getKey());
            }
            oldDatasetJson.add(entry.getKey(), changes);
        }

        logger.debug("Changed dataset Json element: {}", oldDatasetJson.toString());

        Dataset newDataset = gson.fromJson(oldDatasetJson.toString(), Dataset.class);
        newDataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = datasetRepository.save(newDataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);

    }


    /**
     * Return list of all datasets in catalog.
     * Without parameters, the first 20 datasets are returned
     * The returned data contains paging hyperlinks.
     * <p>
     * @param catalogId the id of the catalog
     * @param pageable number of datasets returned
     * @return List of data sets, with hyperlinks to other pages in search result
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Dataset>> listDatasets(@PathVariable("catalogId") String catalogId, Pageable pageable, PagedResourcesAssembler assembler) {

        Page<Dataset> datasets = datasetRepository.findByCatalogId(catalogId, pageable);
        return new ResponseEntity<>(assembler.toResource(datasets), HttpStatus.OK);
    }


    /**
     * Delete dataset
     * @param id Identifier of dataset
     * @return HTTP status 200 OK is returned if dataset was successfully deleted. Body empty.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @PreAuthorize("hasPermission(#catalogId, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> deleteDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String id) {
        Optional<Dataset> datasetOptional = datasetRepository.findById(id);
        Dataset dataset = datasetOptional.isPresent() ? datasetOptional.get() : null;

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalogId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        datasetRepository.delete(dataset);

        return new ResponseEntity<>(HttpStatus.OK);
    }




}
