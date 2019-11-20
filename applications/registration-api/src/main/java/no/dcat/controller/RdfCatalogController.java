package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.repository.DatasetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.OK;

/**
 * Created by dask on 10.04.2017.
 */
@RestController
@RequestMapping(value = "/catalogs")
public class RdfCatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    private final CatalogRepository catalogRepository;

    private final DatasetRepository datasetRepository;

    @Autowired
    public RdfCatalogController(CatalogRepository catalogRepository, DatasetRepository datasetRepository) {
        this.catalogRepository = catalogRepository;
        this.datasetRepository = datasetRepository;
    }



    @RequestMapping(value = "/{id}",
            method = RequestMethod.GET,
            produces = {"text/turtle", "application/ld+json", "application/rdf+xml"})
    public HttpEntity<Catalog> getCatalog(@PathVariable("id") String id) {

        logger.info("Export rdf catalog {} ",id);

        Optional<Catalog> catalogOptional = catalogRepository.findById(id);

        if (!catalogOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Catalog catalog = catalogOptional.get();

        // TODO fix limitation in more than 1000 datasets
        Page<Dataset> datasets = datasetRepository
                .findByCatalogIdAndRegistrationStatus(catalog.getId(), Dataset.REGISTRATION_STATUS_PUBLISH, new PageRequest(0,1000));

        if (datasets != null) {
            List<no.dcat.shared.Dataset> theList = new ArrayList<>();
            datasets.forEach(theList::add);
            catalog.setDataset(theList);
            logger.info("exported {} datasets", datasets.getTotalElements());
        }


        return new ResponseEntity<>(catalog, OK);
    }


}
