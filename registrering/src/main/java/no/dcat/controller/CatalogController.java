package no.dcat.controller;

import no.dcat.factory.RegistrationFactory;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    /**
     * Lists all catalogs available
     *
     * @param pageable
     * @param assembler
     * @return
     */
    @CrossOrigin
    @RequestMapping(value = "",
            method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Dataset>> listCatalogs(Pageable pageable,
                                                            PagedResourcesAssembler assembler) {
        Page<Catalog> catalogs = catalogRepository.findAll(pageable);
        return new ResponseEntity<>(assembler.toResource(catalogs), OK);
    }

    /**
     * Creates a catalog.
     *
     * @param catalog catalog skeleton to copy from
     * @return new catalog object
     */
    @CrossOrigin
    @RequestMapping(value = "", method = POST,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> createCatalog(@RequestBody Catalog catalog) {
        logger.info("Add catalog: " + catalog.toString());
        if(catalog.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        catalog.setPublisher(getPublisher(catalog));

        if (catalog.getUri() == null) {
            catalog.setUri(RegistrationFactory.INSTANCE.getCatalogUri(catalog.getId()));
        }

        Catalog savedCatalog = catalogRepository.save(catalog);
        return new ResponseEntity<>(savedCatalog, OK);
    }

    private Publisher getPublisher(Catalog catalog) {

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://data.brreg.no/enhetsregisteret/enhet/" + catalog.getId() + ".json";
        Enhet enhet = restTemplate.getForObject(uri, Enhet.class);

        Publisher publisher = new Publisher();
        publisher.setId(catalog.getId());
        publisher.setName(enhet.getNavn());
        publisher.setUri(uri);

        return publisher;
    }

    /**
     * Update existing catalog.
     *
     * @param id the of the catalog
     * @param catalog the catalog object with fields to update
     * @return the saved catalog
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}",
            method = PUT,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> updateCatalog(@PathVariable("id") String id,
                                             @RequestBody Catalog catalog) {
        logger.info("Modify catalog: " + catalog.toString());

        if (!catalog.getId().equals(id)) {
            return new ResponseEntity<Catalog>(HttpStatus.BAD_REQUEST);
        }

        if (catalog.getPublisher() == null) {
            catalog.setPublisher(getPublisher(catalog));
        }

        if (catalog.getUri() == null) {
            catalog.setUri(RegistrationFactory.INSTANCE.getCatalogUri(catalog.getId()));
        }

        Catalog savedCatalog = catalogRepository.save(catalog);

        return new ResponseEntity<>(savedCatalog, OK);
    }

    /**
     * Login method (temporary solution until SAML)
     *
     * @return acknowledgment of success or failure
     */
    @CrossOrigin
    @RequestMapping(value = "/login", method = POST,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<String> authenticate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get logged in username
        String username = auth.getName();
        logger.info("Authenticating user: ");
        return new ResponseEntity<>(username, OK);
    }

    /**
     * Deletes a catalog
     *
     * @param id the catalog id to delet
     * @return acknowledgement of success or failure
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> removeCatalog(@PathVariable("id") String id) {
        logger.info("Delete catalog: " + id);
        catalogRepository.delete(id);
        return new ResponseEntity<>(OK);
    }

    /**
     * Gets a catalog
     *
     * @param id of the catalog
     * @return the catalog if it exist
     */
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> getCatalog(@PathVariable("id") String id) {
        Catalog catalog = catalogRepository.findOne(id);

        if (catalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(catalog, OK);
    }
}
