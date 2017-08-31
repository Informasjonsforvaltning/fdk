package no.dcat.controller;

import no.dcat.authorization.EntityNameService;
import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Publisher;
import no.dcat.service.CatalogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/catalogs")
public class CatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private SpringSecurityContextBean springSecurityContextBean;

    @Autowired
    private EntityNameService entityNameService;


    /**
     * Lists all authorised catalogs
     *
     * @return
     */
    @CrossOrigin
    @RequestMapping(value = "",
            method = GET,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<PagedResources<Catalog>> listCatalogs(Pageable pageable,
                                                            PagedResourcesAssembler assembler) {

        Authentication auth = springSecurityContextBean.getAuthentication();

        Set<String> validCatalogs = new HashSet<>();

        for (GrantedAuthority authority : auth.getAuthorities()) {
                validCatalogs.add(authority.getAuthority());
        }

        Page<Catalog> catalogs = catalogRepository.findByIdIn(new ArrayList<>(validCatalogs), pageable);

        return new ResponseEntity<>(assembler.toResource(catalogs), OK);
    }

    /**
     * Creates a catalog.
     *
     * @param catalog catalog skeleton to copy from
     * @return new catalog object
     */
    @PreAuthorize("hasPermission(#catalog.id, 'write')")
    @CrossOrigin
    @RequestMapping(value = "", method = POST,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> createCatalog(@RequestBody Catalog catalog) {

        logger.info("Add catalog: " + catalog.toString());
        if (catalog.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Catalog savedCatalog = saveCatalog(catalog);

        return new ResponseEntity<>(savedCatalog, OK);
    }

    protected Catalog saveCatalog(Catalog catalog) {
        catalog.setPublisher(getPublisher(catalog));

        if (catalog.getUri() == null) {
            catalog.setUri(RegistrationFactory.INSTANCE.getCatalogUri(catalog.getId()));
        }

        return catalogRepository.save(catalog);
    }

    private Publisher getPublisher(Catalog catalog) {

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://data.brreg.no/enhetsregisteret/enhet/" + catalog.getId() + ".json";
        Enhet enhet = null;
        try {
            enhet = restTemplate.getForObject(uri, Enhet.class);
        } catch (Exception e) {
            logger.error("Failed to get org-unit from enhetsregister for organization number {}. Reason {}", catalog.getId(), e.getLocalizedMessage());

            String organizationName = entityNameService.getOrganizationName(catalog.getId());

            enhet = new Enhet();
            enhet.setNavn(organizationName);
        }

        Publisher publisher = new Publisher();
        publisher.setId(catalog.getId());
        publisher.setName(enhet.getNavn());
        publisher.setUri(uri);

        return publisher;
    }

    /**
     * Update existing catalog.
     *
     * @param id      the of the catalog
     * @param catalog the catalog object with fields to update
     * @return the saved catalog
     */
    @PreAuthorize("hasPermission(#catalog.id, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}",
            method = PUT,
            consumes = APPLICATION_JSON_VALUE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<Catalog> updateCatalog(@PathVariable("id") String id,
                                             @RequestBody Catalog catalog) {
        logger.info("Modify catalog: " + catalog.toString());

        if (!catalog.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
     * Deletes a catalog
     *
     * @param id the catalog id to delet
     * @return acknowledgement of success or failure
     */
    @PreAuthorize("hasPermission(#catalog.id, 'write')")
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
    @PreAuthorize("hasPermission(#id, 'read')")
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
