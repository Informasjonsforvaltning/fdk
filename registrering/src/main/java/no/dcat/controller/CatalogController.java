package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.model.Publisher;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs")
public class CatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    @Autowired
    private CatalogRepository catalogRepository;

    @CrossOrigin
    @RequestMapping(value = "", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Dataset>> listCatalogs(Pageable pageable, PagedResourcesAssembler assembler) {
        Page<Catalog> catalogs = catalogRepository.findAll(pageable);
        return new ResponseEntity<>(assembler.toResource(catalogs), OK);
    }

    @CrossOrigin
    @RequestMapping(value = "", method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> addCatalog(@RequestBody Catalog catalog) {
        logger.info("Add catalog: " + catalog.toString());
        if(catalog.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://data.brreg.no/enhetsregisteret/enhet/" + catalog.getId() + ".json";
        Enhet enhet = restTemplate.getForObject(uri, Enhet.class);

        Publisher publisher = new Publisher();
        publisher.setId(catalog.getId());
        publisher.setName(enhet.getNavn());
        publisher.setUri(uri);
        catalog.setPublisher(publisher);

        Catalog savedCatalog = catalogRepository.save(catalog);
        return new ResponseEntity<>(savedCatalog, OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = PUT, consumes = APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> addCatalog(@PathVariable("id") String id, @RequestBody Catalog catalog) {
        logger.info("Modify catalog: " + catalog.toString());

        catalog.setId(id);

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://data.brreg.no/enhetsregisteret/enhet/" + catalog.getId() + ".json";
        Enhet enhet = restTemplate.getForObject(uri, Enhet.class);

        Publisher publisher = new Publisher();
        publisher.setId(catalog.getId());
        publisher.setName(enhet.getNavn());
        publisher.setUri(uri);
        catalog.setPublisher(publisher);

        Catalog savedCatalog = catalogRepository.save(catalog);
        return new ResponseEntity<>(savedCatalog, OK);
    }


    @CrossOrigin
    @RequestMapping(value = "/login", method = POST, produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<String> authenticate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); //get logged in username
        logger.info("Authenticating user: ");
        return new ResponseEntity<>(username, OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE, consumes = APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> removeCatalog(@PathVariable("id") String id) {
        logger.info("Delete catalog: " + id);
        catalogRepository.delete(id);
        return new ResponseEntity<>(OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> getCatalog(@PathVariable("id") String id) {
        Catalog catalog = catalogRepository.findOne(id);

        if (catalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(catalog, OK);
    }
}
