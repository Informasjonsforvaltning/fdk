package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import javax.annotation.PostConstruct;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

/**
 * Created by dask on 10.04.2017.
 */
@RestController
@RequestMapping(value = "/catalogs")
public class RdfCatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public HttpEntity<Catalog> getCatalog(@PathVariable("id") String id) {

        logger.debug ("get rdf catalog {} ",id);

        Catalog catalog = catalogRepository.findOne(id);

        if (catalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // TODO fix limitation in more than 50 datasets
        Page<Dataset> datasets = datasetRepository.findByCatalog(catalog.getId(), new PageRequest(0,50));
        catalog.setDataset(datasets.getContent());

        return new ResponseEntity<>(catalog, OK);
    }


}