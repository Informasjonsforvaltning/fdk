package no.dcat.controller;

import no.dcat.authorization.EntityNameService;
import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.service.CatalogRepository;
import no.dcat.service.HarvesterService;
import no.dcat.shared.Publisher;
import no.dcat.shared.admin.DcatSourceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.*;

import org.apache.commons.codec.binary.Base64;

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

    private final CatalogRepository catalogRepository;

    private final SpringSecurityContextBean springSecurityContextBean;

    private final EntityNameService entityNameService;

    private HarvesterService harvesterService;

    @Autowired
    public CatalogController(CatalogRepository catalogRepository, SpringSecurityContextBean springSecurityContextBean, EntityNameService entityNameService) {
        this.catalogRepository = catalogRepository;
        this.springSecurityContextBean = springSecurityContextBean;
        this.entityNameService = entityNameService;
    }


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

        createCatalogsIfNeeded(validCatalogs);

        catalogs = catalogRepository.findByIdIn(new ArrayList<>(validCatalogs), pageable);

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

        logger.info("Create catalog: {}. Details {}", catalog.getId(), catalog.toString() );
        if (catalog.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Catalog savedCatalog = saveCatalog(catalog);

        //Create harvest entry in Harvester for the new catalog
        //TODO se på intialisering av harvesterservicve
        this.harvesterService = new HarvesterService();
        boolean harvestEntryCreated = harvesterService.createHarvestEntry(catalog);
        logger.info("Harves entry creation successfull: {}", harvestEntryCreated);

        return new ResponseEntity<>(savedCatalog, OK);
    }

    Catalog saveCatalog(Catalog catalog) {
        catalog.setPublisher(getPublisher(catalog));

        if (catalog.getUri() == null) {
            catalog.setUri(RegistrationFactory.getCatalogUri(catalog.getId()));
        }

        return catalogRepository.save(catalog);
    }

    Publisher getPublisher(Catalog catalog) {

        RestTemplate restTemplate = new RestTemplate();
        String uri = "http://data.brreg.no/enhetsregisteret/enhet/" + catalog.getId() ;
        Enhet enhet;
        try {
            enhet = restTemplate.getForObject(uri + ".json", Enhet.class);
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

        Catalog existingCatalog = catalogRepository.findOne(id);
        if (existingCatalog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!catalog.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (catalog.getPublisher() == null) {
            catalog.setPublisher(getPublisher(catalog));
        }

        if (catalog.getUri() == null) {
            catalog.setUri(RegistrationFactory.getCatalogUri(catalog.getId()));
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
    @PreAuthorize("hasPermission(#id, 'write')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE,
            produces = APPLICATION_JSON_UTF8_VALUE)
    public HttpEntity<String> removeCatalog(@PathVariable("id") String id) {
        logger.info("Delete catalog: " + id);
        catalogRepository.delete(id);

        //TODO: FDK-1024 slett fra harvester hvis den finnes der. OBS miljøer.

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


    void createCatalogsIfNeeded(Collection<String> organizations) {
        organizations.forEach(this::createCatalogIfNotExists);
    }

    Catalog createCatalogIfNotExists(String orgnr) {
        if (! orgnr.matches("\\d{9}")) {
            return null;
        }

        Catalog catalog = catalogRepository.findOne(orgnr);
        if (catalog == null) {

            Catalog newCatalog = new Catalog(orgnr);

            String organizationName = entityNameService.getOrganizationName(orgnr);
            if (organizationName != null) {
                newCatalog.getTitle().put("nb", "Datakatalog for " + organizationName);
            }
            HttpEntity<Catalog> response = createCatalog(newCatalog);
            if (response.getBody() == null) {
                return null;
            }

            return newCatalog;
        }
        return catalog;
    }

}
