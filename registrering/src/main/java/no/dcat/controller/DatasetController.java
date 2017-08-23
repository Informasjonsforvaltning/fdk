package no.dcat.controller;

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
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Calendar;
import java.util.Objects;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@Controller
@RequestMapping("/catalogs/{cat_id}/datasets")
public class DatasetController {

    private static Logger logger = LoggerFactory.getLogger(DatasetController.class);

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;

    DatasetRepository getDatasetRepository() {
        return datasetRepository;
    }

    CatalogRepository getCatalogRepository() {
        return catalogRepository;
    }

    /**
     * Get complete dataset
     * @param id Identifier of dataset
     * @return complete dataset. HTTP status 200 OK is returned if dataset is found.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> getDataset(@PathVariable("cat_id") String catalogId, @PathVariable("id") String id) {
        Dataset dataset = getDatasetRepository().findOne(id);

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalog())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dataset, HttpStatus.OK);
    }


    /**
     * Create new dataset in catalog. ID for the dataset is created automatically.
     * @param copy
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @CrossOrigin
    @RequestMapping(value = "/", method = POST,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> saveDataset(@PathVariable("cat_id") String catalogId,
                                           @RequestBody Dataset copy) throws CatalogNotFoundException {

        Catalog catalog = getCatalogRepository().findOne(catalogId);

        if (catalog == null) {
            throw new CatalogNotFoundException(String.format("Unable to create dataset, catalog with id %s not found", catalogId));
        }

        Dataset savedDataset = saveDataset(catalogId, copy, catalog);


        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }

    protected Dataset saveDataset(String catalogId, Dataset copy, Catalog catalog) {

        // Create new dataset
        Dataset dataset = RegistrationFactory.INSTANCE.createDataset(catalogId);

        dataset.setTitle(copy.getTitle());
        dataset.setDescription(copy.getDescription());
        dataset.setObjective(copy.getObjective());
        dataset.setContactPoint(copy.getContactPoint());

        dataset.setKeyword(copy.getKeyword());
        // force publisher
        dataset.setPublisher(catalog.getPublisher());

        dataset.setIssued(copy.getIssued());
        dataset.setModified(copy.getModified());
        dataset.setLanguage(copy.getLanguage());
        dataset.setLandingPage(copy.getLandingPage());
        dataset.setTheme(copy.getTheme());
        dataset.setDistribution(copy.getDistribution());
        dataset.setSample(copy.getSample());
        dataset.setConformsTo(copy.getConformsTo());
        dataset.setTemporal(copy.getTemporal());
        dataset.setSpatial(copy.getSpatial());

        dataset.setAccessRights(copy.getAccessRights());
        dataset.setReferences(copy.getReferences());
        dataset.setProvenance(copy.getProvenance());
        dataset.setIdentifier(copy.getIdentifier());
        dataset.setPage(copy.getPage());
        dataset.setAccrualPeriodicity(copy.getAccrualPeriodicity());
        dataset.setSubject(copy.getSubject());
        dataset.setType(copy.getType());
        dataset.setAdmsIdentifier(copy.getAdmsIdentifier());
        dataset.setRegistrationStatus(Dataset.REGISTRATION_STATUS_DRAFT);

        //Store metainformation about editing
        logger.debug("create dataset {} at timestamp {}", dataset.getId(), Calendar.getInstance().getTime());
        dataset.set_lastModified(Calendar.getInstance().getTime());

        return getDatasetRepository().save(dataset);
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
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = PUT,
            consumes = APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> saveDataset(@PathVariable("cat_id") String catalogId, @PathVariable("id") String datasetId, @RequestBody Dataset dataset) {
        logger.info("requestbody dataset: " + dataset.toString());
        dataset.setId(datasetId);
        dataset.setCatalog(catalogId);

        //Add metaifnormation about editing
        dataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = getDatasetRepository().save(dataset);
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
    @CrossOrigin
    @RequestMapping(value = "", method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Dataset>> listDatasets(@PathVariable("cat_id") String catalogId,
                                                            Pageable pageable,
                                                            PagedResourcesAssembler assembler) {

        Page<Dataset> datasets = getDatasetRepository().findByCatalog(catalogId, pageable);
        return new ResponseEntity<>(assembler.toResource(datasets), HttpStatus.OK);
    }


    /**
     * Delete dataset
     * @param id Identifier of dataset
     * @return HTTP status 200 OK is returned if dataset was successfully deleted. Body empty.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}",
            method = DELETE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> deleteDataset(@PathVariable("cat_id") String catalogId,
                                             @PathVariable("id") String id) {
        Dataset dataset = getDatasetRepository().findOne(id);

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalog())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        getDatasetRepository().delete(dataset);

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
