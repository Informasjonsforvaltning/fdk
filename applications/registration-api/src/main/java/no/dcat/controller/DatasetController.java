package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import no.ccat.common.model.Concept;
import no.dcat.factory.DatasetFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.exceptions.CatalogNotFoundException;
import no.dcat.model.exceptions.ErrorResponse;
import no.dcat.service.CatalogRepository;
import no.dcat.service.ConceptCatClient;
import no.dcat.service.DatasetRepository;
import no.dcat.shared.Subject;
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
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/catalogs/{catalogId}/datasets")
public class DatasetController {

    private static Logger logger = LoggerFactory.getLogger(DatasetController.class);

    private DatasetRepository datasetRepository;
    private CatalogRepository catalogRepository;
    private ConceptCatClient conceptCatClient;

    @Autowired
    public DatasetController(DatasetRepository datasetRepository, CatalogRepository catalogRepository, ConceptCatClient conceptCatClient) {
        this.datasetRepository = datasetRepository;
        this.catalogRepository = catalogRepository;
        this.conceptCatClient = conceptCatClient;
    }

    /**
     * Return list of all datasets in catalog.
     * Without parameters, the first 20 datasets are returned
     * The returned data contains paging hyperlinks.
     * <p>
     *
     * @param catalogId the id of the catalog
     * @param pageable  number of datasets returned
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
     * Get complete dataset
     *
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
     *
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
        Dataset datasetWithNewId = DatasetFactory.createDataset(catalogId);

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
     *
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

        if (!datasetRepository.findById(dataset.getId()).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        //Add metainformation about editing
        dataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = datasetRepository.save(dataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }


    /**
     * Modify dataset in catalog.
     *
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
        List<Concept> conceptListFromReq;
        List<Concept> conceptsGetByIds = new ArrayList<>();
        Subject subject;
        List<Subject> subjects = new ArrayList<>();
/* TODO
Following commits resulted unfinished work that has be fixed some times:

a8f3c7348b198da721e5c74fc8a6702d488639fa
1096c7c19f763c5cb72de97962249d64e93e2aba

The problem was fixing linking datasets to concepts, after concept had moved out to
its own separate service - concept-cat.

We had a temporary idea that we could introduce temporary reference field model to
refer to the new concepts ( Dataset -> List<Concept> concepts).
It did not quite work out, because due to duplicate data storage, Dataset model has
to also have RDF schema updated, which was unreasonable.
It turned out, that we can continue using "List<Subject> subject" field for storing
the reference to the now new concept location.

Cleanup work of reverting the List<Concept> concepts has not been done.

The reason why instead of fixing it, we have this TODO item here
is that we are planning to reimplement dataset registration system (a.k.a. "dropping the fuseki")
and it is quite high in priority list.

 */
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            logger.debug("update key: {} value: ", entry.getKey(), entry.getValue());
            JsonElement changes = gson.toJsonTree(entry.getValue());

            if (oldDatasetJson.has(entry.getKey())) {
                oldDatasetJson.remove(entry.getKey());
                if (entry.getKey().equals("concepts")) {
                    oldDatasetJson.remove("subject");
                }
            }
            if ("concepts".equals(entry.getKey())) {

                JsonElement jsonElementConcept = gson.toJsonTree(entry.getValue());
                Type listType = new TypeToken<List<Concept>>() {
                }.getType();
                conceptListFromReq = new Gson().fromJson(jsonElementConcept, listType);

                logger.debug("Concept list size: {}", conceptListFromReq.size());
                List<String> ids = conceptListFromReq.stream().map(Concept::getId).collect(Collectors.toList());

                conceptsGetByIds = conceptCatClient.getByIds(ids);

            } else {

                oldDatasetJson.add(entry.getKey(), changes);
            }
        }

        logger.debug("Changed dataset Json element: {}", oldDatasetJson.toString());

        Dataset newDataset = gson.fromJson(oldDatasetJson.toString(), Dataset.class);
        newDataset.set_lastModified(Calendar.getInstance().getTime());

        if (conceptsGetByIds.size() != 0) {
            for (Concept concept : conceptsGetByIds) {
                subject = new Subject();
                subject.setId(concept.getId());
                subject.setUri(concept.getUri());
                subject.setDefinition(concept.getDefinition().getText());
                subject.setPrefLabel(concept.getPrefLabel());
                subject.setAltLabel(concept.getAltLabel());
                subject.setIdentifier(concept.getIdentifier());
                subjects.add(subject);
            }

            newDataset.setSubject(subjects);
            newDataset.setConcepts(conceptsGetByIds);
        }

        Dataset savedDataset = datasetRepository.save(newDataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);

    }

    /**
     * Delete dataset
     *
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
