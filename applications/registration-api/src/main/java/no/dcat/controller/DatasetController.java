package no.dcat.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import no.ccat.common.model.Concept;
import no.dcat.model.DatasetFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.ConceptCatClient;
import no.dcat.service.DatasetRepository;
import no.dcat.shared.Subject;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
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
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'read')")
    @RequestMapping(value = "", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public PagedResources<Resource<Dataset>> listDatasets(@PathVariable("catalogId") String catalogId, Pageable pageable, PagedResourcesAssembler<Dataset> assembler) {

        Page<Dataset> datasets = datasetRepository.findByCatalogId(catalogId, pageable);
        return assembler.toResource(datasets);
    }


    /**
     * Get complete dataset
     *
     * @param id Identifier of dataset
     * @return complete dataset. HTTP status 200 OK is returned if dataset is found.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'read')")
    @RequestMapping(value = "/{id}", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset getDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String id) throws NotFoundException {

        Optional<Dataset> datasetOptional = datasetRepository.findById(id);
        Dataset dataset = datasetOptional.orElseThrow(() -> new NotFoundException());

        if (!catalogId.equals(dataset.getCatalogId())) {
            throw new NotFoundException();
        }

        return dataset;
    }


    /**
     * Create new dataset in catalog. ID for the dataset is created automatically.
     *
     * @param data
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'write')")
    @RequestMapping(value = "", method = POST, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset saveDataset(@PathVariable("catalogId") String catalogId, @RequestBody Dataset data) throws NotFoundException {

        Optional<Catalog> catalogOptional = catalogRepository.findById(catalogId);

        Catalog catalog = catalogOptional.orElseThrow(() -> new NotFoundException("Catalog not found"));

        Dataset dataset = DatasetFactory.createDataset(catalog, data);

        logger.debug("create dataset {} at timestamp {}", dataset.getId(), dataset.get_lastModified());

        return datasetRepository.save(dataset);
    }

    /**
     * Modify dataset in catalog.
     *
     * @param dataset
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'write')")
    @RequestMapping(value = "/{id}", method = PUT, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset saveDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String datasetId, @RequestBody Dataset dataset) throws NotFoundException {
        logger.info("PUT requestbody dataset: " + dataset.toString());
        dataset.setId(datasetId);
        dataset.setCatalogId(catalogId);

        Optional<Dataset> oldDatasetOptional = datasetRepository.findById(datasetId);
        Dataset oldDataset = oldDatasetOptional.orElseThrow(() -> new NotFoundException());

        if (!catalogId.equals(oldDataset.getCatalogId())) {
            throw new NotFoundException();
        }
        //Add metainformation about editing
        dataset.set_lastModified(new Date());

        return datasetRepository.save(dataset);
    }


    /**
     * Modify dataset in catalog.
     *
     * @param updates Objects in datatset to be updated
     * @return HTTP 200 OK if dataset could be could be updated.
     */
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'write')")
    @RequestMapping(value = "/{id}", method = PATCH, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public Dataset updateDataset(@PathVariable("catalogId") String catalogId,
                                 @PathVariable("id") String datasetId,
                                 @RequestBody Map<String, Object> updates) throws NotFoundException {
        logger.info("PATCH requestbody update dataset: " + updates.toString());

        Gson gson = new Gson();

        //get already saved dataset
        Optional<Dataset> oldDatasetOptional = datasetRepository.findById(datasetId);
        Dataset oldDataset = oldDatasetOptional.orElseThrow(() -> new NotFoundException());

        if (!catalogId.equals(oldDataset.getCatalogId())) {
            throw new NotFoundException();
        }

        logger.info("found old dataset: {}", oldDataset.getId());

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
        newDataset.set_lastModified(new Date());

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

        return datasetRepository.save(newDataset);
    }

    /**
     * Delete dataset
     *
     * @param id Identifier of dataset
     * @return HTTP status 200 OK is returned if dataset was successfully deleted. Body empty.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @PreAuthorize("hasPermission(#catalogId, 'publisher', 'write')")
    @RequestMapping(value = "/{id}", method = DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    public void deleteDataset(@PathVariable("catalogId") String catalogId, @PathVariable("id") String id) throws NotFoundException {
        Optional<Dataset> oldDatasetOptional = datasetRepository.findById(id);
        Dataset dataset = oldDatasetOptional.orElseThrow(() -> new NotFoundException());

        if (!catalogId.equals(dataset.getCatalogId())) {
            throw new NotFoundException();
        }

        datasetRepository.delete(dataset);
    }


}
