package no.dcat.controller;

import no.dcat.authorization.EntityNameService;
import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.factory.DatasetFactory;
import no.dcat.model.Catalog;
import no.dcat.service.CatalogRepository;
import no.dcat.service.EnhetService;
import no.dcat.service.HarvesterService;
import no.dcat.shared.Publisher;
import no.dcat.shared.admin.DcatSourceDto;
import org.elasticsearch.index.IndexNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs")
public class CatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    private final CatalogRepository catalogRepository;

    private final SpringSecurityContextBean springSecurityContextBean;

    private final EntityNameService entityNameService;

    private final HarvesterService harvesterService;

    EnhetService enhetService;

    @Value("${saml.sso.context-provider.lb.server-name}")
    private String serverName;

    @Value("${saml.sso.context-provider.lb.server-port}")
    private String serverPort;

    @Value("${saml.sso.context-provider.lb.include-server-port-in-request-url}")
    private boolean includeServerPortInUrl;

    @Value("${application.openDataEnhet}")
    private String openDataEnhetsregisteret;


    @Autowired
    public CatalogController(CatalogRepository catalogRepository, SpringSecurityContextBean springSecurityContextBean, EntityNameService entityNameService, HarvesterService harvesterService, EnhetService enhetService) {
        this.catalogRepository = catalogRepository;
        this.springSecurityContextBean = springSecurityContextBean;
        this.entityNameService = entityNameService;
        this.harvesterService = harvesterService;
        this.enhetService = enhetService;
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

        createCatalogsIfNeeded(validCatalogs);

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

        logger.info("Create catalog: {}. Details {}", catalog.getId(), catalog.toString());
        if (catalog.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Catalog savedCatalog = saveCatalog(catalog);
        createDatasourceInHarvester(catalog);

        return new ResponseEntity<>(savedCatalog, OK);
    }

    Catalog saveCatalog(Catalog catalog) {
        catalog.setPublisher(getPublisher(catalog));

        if (catalog.getUri() == null) {
            catalog.setUri(DatasetFactory.getCatalogUri(catalog.getId()));
        }

        return catalogRepository.save(catalog);
    }

    Publisher getPublisher(Catalog catalog) {
        String uri = openDataEnhetsregisteret + catalog.getId();
        Enhet enhet = enhetService.getByOrgNr(catalog.getId(), uri, entityNameService);

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

        if (!catalogRepository.findById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!catalog.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (catalog.getPublisher() == null) {
            catalog.setPublisher(getPublisher(catalog));
        }

        if (catalog.getUri() == null) {
            catalog.setUri(DatasetFactory.getCatalogUri(catalog.getId()));
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
        catalogRepository.deleteById(id);

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
        Optional<Catalog> catalogOptional = catalogRepository.findById(id);
        if (!catalogOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(catalogOptional.get(), OK);
    }


    void createCatalogsIfNeeded(Collection<String> organizations) {
        organizations.forEach(this::createCatalogIfNotExists);
    }

    Catalog createCatalogIfNotExists(String orgnr) {
        if (!orgnr.matches("\\d{9}")) {
            return null;
        }
        boolean noIndex = false;
        Optional<Catalog> catalogOptional = Optional.empty();

        try {
            catalogOptional = catalogRepository.findById(orgnr);
        } catch (IndexNotFoundException infe) {
            noIndex = true;
        }


        if (noIndex || (!catalogOptional.isPresent())) {

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
        return catalogOptional.get();
    }


    /**
     * Create a new data source for the catalog in harvester,
     * if it does not already exist
     *
     * @param catalog
     */
    public void createDatasourceInHarvester(Catalog catalog) {
        //Get existing harvester entries from harvester
        List<DcatSourceDto> existingHarvesterDataSources = harvesterService.getHarvestEntries();

        String catalogHarvestEndpoint = getRegistrationBaseUrl() + "/catalogs/" + catalog.getId();
        boolean catalogFound = false;

        logger.info("checking if catalog with url {} already exists as data source", catalogHarvestEndpoint);

        for (DcatSourceDto datasourceEntry : existingHarvesterDataSources) {
            logger.debug("Found exisiting dcatsource entry: {}", datasourceEntry.getUrl());
            if (datasourceEntry.getUrl().equals(catalogHarvestEndpoint)) {
                logger.info("Catalog already exists as a data source in harvester");
                catalogFound = true;
            }
        }

        //if current catalog does not exist as a dat source, create it
        if (!catalogFound) {
            logger.info("Harvest entry not found - create new datasource for catalog in harvester");
            boolean harvestEntryCreated = harvesterService.createHarvestEntry(catalog, catalogHarvestEndpoint);
            logger.info("Harvest entry creation successful: {}", harvestEntryCreated);
        }
    }


    /**
     * Helper method to generate the base uri for the registration api
     *
     * @return String containing base uri
     */
    public String getRegistrationBaseUrl() {

        /*
        Temporary: use internal url instead of external one due to routing issues

        StringBuilder host = new StringBuilder();
        String protocol = "https://";
        host.append(protocol);
        host.append(serverName);
        if (includeServerPortInUrl) {
            host.append(":").append(serverPort);
        }
        return host.toString();
        */
        return "http://registration-api:8080";
    }

}
