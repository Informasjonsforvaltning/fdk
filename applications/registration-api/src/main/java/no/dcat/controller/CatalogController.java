package no.dcat.controller;

import no.dcat.model.Enhet;
import no.dcat.service.SpringSecurityContextService;
import no.dcat.model.Catalog;
import no.dcat.service.CatalogRepository;
import no.dcat.service.EnhetService;
import no.dcat.service.HarvesterService;
import no.dcat.shared.Publisher;
import no.dcat.shared.admin.DcatSourceDto;
import no.fdk.webutils.exceptions.BadRequestException;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/catalogs")
public class CatalogController {

    private static Logger logger = LoggerFactory.getLogger(CatalogController.class);

    private final CatalogRepository catalogRepository;

    private final SpringSecurityContextService springSecurityContextService;

    private final HarvesterService harvesterService;

    EnhetService enhetService;

    @Value("${application.openDataEnhet}")
    private String openDataEnhetsregisteret;


    @Autowired
    public CatalogController(CatalogRepository catalogRepository, SpringSecurityContextService springSecurityContextService, HarvesterService harvesterService, EnhetService enhetService) {
        this.catalogRepository = catalogRepository;
        this.springSecurityContextService = springSecurityContextService;
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
    public PagedResources<Resource<Catalog>> listCatalogs(Pageable pageable, PagedResourcesAssembler<Catalog> assembler) {

        Authentication auth = springSecurityContextService.getAuthentication();

        Set<String> validCatalogs = new HashSet<>();

        for (GrantedAuthority authority : auth.getAuthorities()) {
            validCatalogs.add(authority.getAuthority());
        }

        if (validCatalogs.size() == 0) {
            return assembler.toResource(new PageImpl<>(new ArrayList<>(), pageable, 0));
        }

        createCatalogsIfNeeded(validCatalogs);

        Page<Catalog> catalogs = catalogRepository.findByIdIn(new ArrayList<>(validCatalogs), pageable);

        return assembler.toResource(catalogs);
    }

    /**
     * Creates a catalog.
     *
     * @param catalog catalog skeleton to copy from
     * @return new catalog object
     */
    @PreAuthorize("hasPermission(#catalog.id, 'publisher', 'admin')")
    @CrossOrigin
    @RequestMapping(value = "", method = POST,
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public Catalog createCatalog(@RequestBody Catalog catalog) throws BadRequestException {

        logger.info("Create catalog: {}. Details {}", catalog.getId(), catalog.toString());
        if (catalog.getId() == null) {
            throw new BadRequestException();
        }

        Catalog savedCatalog = saveCatalog(catalog);
        createDatasourceInHarvester(catalog);

        return savedCatalog;
    }

    Catalog saveCatalog(Catalog catalog) {
        catalog.setPublisher(getPublisher(catalog));

        if (catalog.getUri() == null) {
            catalog.setUri(getCatalogUri(catalog.getId()));
        }

        return catalogRepository.save(catalog);
    }

    Publisher getPublisher(Catalog catalog) {
        Enhet enhet = enhetService.getByOrgNr(catalog.getId());

        Publisher publisher = new Publisher();
        publisher.setId(catalog.getId());
        publisher.setName(enhet.getNavn());
        String uri = openDataEnhetsregisteret + catalog.getId();
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
    @PreAuthorize("hasPermission(#catalog.id, 'publisher', 'admin')")
    @CrossOrigin
    @RequestMapping(value = "/{id}",
        method = PUT,
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public Catalog updateCatalog(@PathVariable("id") String id,
                                 @RequestBody Catalog catalog) throws NotFoundException, BadRequestException {
        logger.info("Modify catalog: " + catalog.toString());

        if (!catalogRepository.findById(id).isPresent()) {
            throw new NotFoundException();
        }

        if (!catalog.getId().equals(id)) {
            throw new BadRequestException();
        }

        if (catalog.getPublisher() == null) {
            catalog.setPublisher(getPublisher(catalog));
        }

        if (catalog.getUri() == null) {
            catalog.setUri(getCatalogUri(catalog.getId()));
        }

        Catalog savedCatalog = catalogRepository.save(catalog);

        return savedCatalog;
    }

    /**
     * Deletes a catalog
     *
     * @param id the catalog id to delet
     * @return acknowledgement of success or failure
     */
    @PreAuthorize("hasPermission(#id, 'publisher', 'admin')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = DELETE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public void removeCatalog(@PathVariable("id") String id) {
        logger.info("Delete catalog: " + id);
        catalogRepository.deleteById(id);

        //TODO: FDK-1024 slett fra harvester hvis den finnes der. OBS miljøer.
    }

    /**
     * Gets a catalog
     *
     * @param id of the catalog
     * @return the catalog if it exist
     */
    @PreAuthorize("hasPermission(#id, 'publisher', 'admin')")
    @CrossOrigin
    @RequestMapping(value = "/{id}", method = GET,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public Catalog getCatalog(@PathVariable("id") String id) throws NotFoundException {
        return catalogRepository.findById(id).orElseThrow(NotFoundException::new);
    }


    void createCatalogsIfNeeded(Collection<String> organizations) {
        organizations.forEach(this::createCatalogIfNotExists);
    }

    void createCatalogIfNotExists(String orgnr) {
        if (!orgnr.matches("\\d{9}")) {
            return;
        }

        Catalog newCatalog = new Catalog(orgnr);

        String organizationName = enhetService.getByOrgNr(orgnr).getNavn();
        if (organizationName != null) {
            newCatalog.getTitle().put("nb", "Datakatalog for " + organizationName);
        }

        try {
            createCatalog(newCatalog);
        } catch (BadRequestException ignore) {
        }
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

        String catalogHarvestEndpoint = getCatalogUri(catalog.getId());
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
        return "http://registration-api:8080";
    }

    String getCatalogUri(String catalogId) {
        /*
            Limitation
            Catalog url works differently accoding to the media tyoe (Accepts header)
            Only  RDF is public without authorization ({"text/turtle", "application/ld+json", "application/rdf+xml"}) (see RdfCatalogController:44)
            This endpoint is implemented with registrationstatus=PUBLIC filter is applied and authentication is not required.

            If json format is requested, then authorization is required and response is withoug status filter
            then json-hal is returned and query is run without filter (see CatalogController:219),

            Proposed solution to overcome this discrepancy:
            Have a different endpoint for public catalogs (like we have for public api registrations /public/apis).
            This way we can have status=public-filtered result in all formats.
        */
        return getRegistrationBaseUrl() + "/catalogs/" + catalogId;
    }

}
