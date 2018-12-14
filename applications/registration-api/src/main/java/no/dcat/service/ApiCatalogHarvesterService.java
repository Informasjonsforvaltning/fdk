package no.dcat.service;

import io.swagger.v3.oas.models.OpenAPI;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.factory.ApiRegistrationFactory;
import no.dcat.model.ApiCatalog;
import no.dcat.model.ApiRegistration;
import no.dcat.model.Status;
import no.fdk.harvestqueue.HarvestQueue;
import no.fdk.harvestqueue.QueuedTask;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Sets up the Harvester that harvests from API Catalogs to Api Registrations (NOT from registrations to Search Indexes)
 * The Catalogs are store in the Elasticsearch Index : Reg-Api-Catalog
 */
@Service
public class ApiCatalogHarvesterService {
    private static Logger logger = LoggerFactory.getLogger(ApiCatalogHarvesterService.class);

    @Value("${application.harvesterUsername}")
    public String harvesterUsername;

    @Value("${application.harvesterPassword}")
    public String harvesterPassword;

    private ApiCatalogRepository apiCatalogRepository;

    private ApiRegistrationRepository apiRegistrationRepository;

    private ApiCatClient apiCatClient;

    private HarvestQueue harvestQueue;

    @Autowired
    public ApiCatalogHarvesterService(ApiRegistrationRepository apiRegistrationRepository, ApiCatalogRepository apiCatalogRepository, HarvestQueue harvestQueue, ApiCatService apiCatService) {
        this.apiRegistrationRepository = apiRegistrationRepository;
        this.apiCatalogRepository = apiCatalogRepository;
        this.harvestQueue = harvestQueue;
        this.apiCatClient = apiCatService.getClient();
    }

    //TODO: Also trigger this every 24h ? (there exists a spring thing to do that)
    @PostConstruct
    public void initQueue() {

        //Get all the catalogs
        List<ApiCatalog> allApiCatalogs = apiCatalogRepository.findAll().getContent();

        //Add them to the queue
        for (ApiCatalog catalog : allApiCatalogs) {
            QueuedTask task = new HarvestSingleCatalogTask();
            try {
                URL catalogURL = new URL(catalog.getHarvestSourceUri());
                ((HarvestSingleCatalogTask) task).urlLocation = catalogURL;
                ((HarvestSingleCatalogTask) task).catalog = catalog;
                harvestQueue.addTask(task);
            } catch (MalformedURLException malf) {
                logger.warn("Failed to parse {} as URL. Continuing to next catalog.", catalog.getHarvestSourceUri());
            }
        }
    }

    protected void doHarvestSingleCatalog(URL urlToCatalog, ApiCatalog originCatalog) {
        logger.info("HarvestSingleCatalog called! url " + urlToCatalog + " origin catalog: " + originCatalog);
        Status status = new Status();
        status.setSuccess(true);

        try {
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(urlToCatalog.openStream()));
            final Model model = ModelFactory.createDefaultModel();
            model.read(reader, null, "TURTLE");//Base and lang is just untested dummy values

            List<String> allApiUrlsForThisCatalog = new ArrayList<String>();
            StmtIterator iterator = model.listStatements();
            while (iterator.hasNext()) {
                Statement st = iterator.next();
                if (st.getPredicate().toString().contains("dcat#dataset")) {
                    allApiUrlsForThisCatalog.add(st.getObject().toString());
                }
            }

            for (String apiSpecUrl : allApiUrlsForThisCatalog) {
                ApiRegistration apiRegistrationData = new ApiRegistration();
                apiRegistrationData.setApiSpecUrl(apiSpecUrl);

                //ConvertTo Reference API
                OpenAPI openAPI = apiCatClient.convert(apiSpecUrl, "");//empty string is api-spec, unknown what this is.
                apiRegistrationData.setOpenApi(openAPI);


                Optional<ApiRegistration> existingApiRegistrationOptional = apiRegistrationRepository.getByCatalogIdAndApiSpecUrl(originCatalog.getOrgNo() ,apiSpecUrl);
                logger.debug("Found existing {}", existingApiRegistrationOptional.isPresent());

                ApiRegistration apiRegistration;
                if (existingApiRegistrationOptional.isPresent()) {
                    logger.debug("Existing {}", existingApiRegistrationOptional.get());
                    apiRegistration = ApiRegistrationFactory.updateApiRegistration(existingApiRegistrationOptional.get(), apiRegistrationData);
                } else {
                    apiRegistration = ApiRegistrationFactory.createApiRegistration(originCatalog.getOrgNo(), apiRegistrationData);
                }

                logger.debug("create apiRegistration {}", apiRegistration.getId());

                ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);

                apiCatClient.triggerHarvestApiRegistration(savedApiRegistration.getId());
            }

        } catch (Exception e) {
            logger.error("Failed while trying to read url {}, exception is  {}", urlToCatalog, e);
            status.setSuccess(false);
            status.setErrorMessage("Failed while trying to fetch and parse API Catalog " + urlToCatalog + " " + e.toString());
        }

        originCatalog.setStatus(status);

    }

    private class HarvestSingleCatalogTask   implements QueuedTask {

        public URL urlLocation;

        public ApiCatalog catalog;

        @Override
        public void doIt() {
            doHarvestSingleCatalog(urlLocation, catalog);
        }

    }
}
