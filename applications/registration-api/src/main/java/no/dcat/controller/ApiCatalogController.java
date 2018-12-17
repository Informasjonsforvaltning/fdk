package no.dcat.controller;

import no.dcat.model.ApiCatalog;
import no.dcat.service.ApiCatalogRepository;
import org.apache.jena.shared.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/apicatalogs")
public class ApiCatalogController {
    private static final Logger logger = LoggerFactory.getLogger(ApiCatalogController.class);

    private ApiCatalogRepository apiCatalogRepository;

    @Autowired
    public ApiCatalogController(ApiCatalogRepository apiDocumentRepository) {
        this.apiCatalogRepository = apiDocumentRepository;
    }

    @CrossOrigin
    @RequestMapping(
        value = "save",
        method = POST,
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiCatalog storeApiCatalog(
        @RequestBody ApiCatalog apiCatalogData) {

        ApiCatalog apiCatalog;

        Optional<ApiCatalog> apiCatalogOptional = apiCatalogRepository.findByOrgNo(apiCatalogData.getOrgNo());
        if (apiCatalogOptional.isPresent()) {
            apiCatalog = apiCatalogOptional.get();
        } else {
            apiCatalog = new ApiCatalog();
            apiCatalog.setId(UUID.randomUUID().toString());
            apiCatalog.setOrgNo(apiCatalogData.getOrgNo());
        }
        apiCatalog.setHarvestSourceUri(apiCatalogData.getHarvestSourceUri());

        apiCatalogRepository.save(apiCatalog);
        return apiCatalog;
    }

    @CrossOrigin
    @RequestMapping(
        value = "get",
        method = GET,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiCatalog getApiRegistration(String organisationNumber) {

        Optional<ApiCatalog> cata = apiCatalogRepository.findByOrgNo(organisationNumber);
        if (cata.isPresent()) {
            return cata.get();
        } else {
            throw new NotFoundException("Did not find any Api Catalog for organization number " + organisationNumber);
        }
    }

    @CrossOrigin
    @RequestMapping(
        value = "delete",
        method = DELETE,
        produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiCatalog deleteApiRegistration(String orgno) {

        Optional<ApiCatalog> cata = apiCatalogRepository.findByOrgNo(orgno);
        apiCatalogRepository.delete(cata.get());
        return cata.get();
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = PUT, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_UTF8_VALUE)
    public ApiCatalog updateApiRegistration(@RequestBody ApiCatalog apiCatalog, String orgNo) {

        Optional<ApiCatalog> catatalogForThisOrganisation = apiCatalogRepository.findByOrgNo(orgNo);
        if (catatalogForThisOrganisation.isPresent()) {
            apiCatalog.setId(catatalogForThisOrganisation.get().getId());
            ApiCatalog savedCatalog = apiCatalogRepository.save(apiCatalog);
            return savedCatalog;
        } else {
            throw new NotFoundException("Did not find any Api Catalog for org number " + orgNo);
        }
    }
}
