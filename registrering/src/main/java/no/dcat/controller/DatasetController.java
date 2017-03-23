package no.dcat.controller;

import no.dcat.factory.DatasetFactory;
import no.dcat.factory.DatasetIdGenerator;
import no.dcat.model.Dataset;
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
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Objects;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
@RequestMapping("/catalogs/{cat_id}/datasets")
public class DatasetController {

    private static Logger logger = LoggerFactory.getLogger(DatasetController.class);

    @Autowired
    private DatasetRepository datasetRepository;


    @Autowired
    private DatasetFactory datasetFactory;

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;




    /**
     * Get complete dataset
     * @param id Identifier of dataset
     * @return complete dataset. HTTP status 200 OK is returned if dataset is found.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> getDataset(@PathVariable("cat_id") String catalogId, @PathVariable("id") String id) {
        Dataset dataset = datasetRepository.findOne(id);

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalog())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dataset, HttpStatus.OK);
    }


    /**
     * Create new dataset in catalog. ID for the dataset is created automatically.
     * @param dataset
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @CrossOrigin
    @RequestMapping(value = "/", method = POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> addDataset(@PathVariable("cat_id") String catalogId, @RequestBody Dataset dataset) {
        DatasetIdGenerator datasetIdGenerator = new DatasetIdGenerator();
        logger.info("requestbody dataset: " + dataset.toString());
        if(dataset.getId() == null) {
            dataset.setId(datasetIdGenerator.createId());
        }
        dataset.setCatalog(catalogId);

        //Store metainformation about editing
        dataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = datasetRepository.save(dataset);

        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }


    /**
     * Modify dataset in catalog.
     * @param dataset
     * @return HTTP 200 OK if dataset could be could be created.
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> addDataset(@PathVariable("cat_id") String catalogId, @PathVariable("id") String datasetId, @RequestBody Dataset dataset) {
        logger.info("requestbody dataset: " + dataset.toString());
        dataset.setId(datasetId);
        dataset.setCatalog(catalogId);

        //Add metaifnormation about editing
        dataset.set_lastModified(Calendar.getInstance().getTime());

        Dataset savedDataset = datasetRepository.save(dataset);
        return new ResponseEntity<>(savedDataset, HttpStatus.OK);
    }

    /**
     * Return list of all datasets in catalog.
     * Without parameters, the first 20 datasets are returned
     * The returned data contains paging hyperlinks.
     * <p>
     * @param page number of pages. First page = 0
     * @param size number of datasets returned
     * @return List of data sets, with hyperlinks to other pages in search result
     */
    @CrossOrigin
    @RequestMapping(value = "", method = RequestMethod.GET, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Dataset>> listDatasets(@PathVariable("cat_id") String catalogId, Pageable pageable,
                                                            PagedResourcesAssembler assembler) {

        Page<Dataset> datasets = datasetRepository.findByCatalog(catalogId, pageable);
        return new ResponseEntity<>(assembler.toResource(datasets), HttpStatus.OK);
    }


    /**
     * Delete dataset
     * @param id Identifier of dataset
     * @return HTTP status 200 OK is returned if dataset was successfully deleted. Body empty.
     * If dataset is not found, HTTP 404 Not found is returned, with an empty body.
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Dataset> deleteDataset(@PathVariable("cat_id") String catalogId, @PathVariable("id") String id) {
        Dataset dataset = datasetRepository.findOne(id);

        if (dataset == null || !Objects.equals(catalogId, dataset.getCatalog())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        datasetRepository.delete(dataset);

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
