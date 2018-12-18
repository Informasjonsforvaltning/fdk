package no.dcat.service;

import io.swagger.v3.oas.models.OpenAPI;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.factory.ApiRegistrationFactory;
import no.dcat.model.ApiCatalog;
import no.dcat.model.ApiRegistration;
import no.dcat.model.HarvestStatus;
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
import java.util.Date;
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
            QueuedTask task = new HarvestSingleCatalogTask(catalog);
            harvestQueue.addTask(task);
        }
    }

    protected void doHarvestSingleCatalog(ApiCatalog originCatalog) {
        logger.info("HarvestSingleCatalog called. Catalog: " + originCatalog);

        try {

            URL catalogUrl = new URL(originCatalog.getHarvestSourceUri());

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(catalogUrl.openStream()));
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

                Optional<ApiRegistration> existingApiRegistrationOptional = apiRegistrationRepository.getByCatalogIdAndApiSpecUrl(originCatalog.getOrgNo(), apiSpecUrl);
                logger.debug("Found existing {}", existingApiRegistrationOptional.isPresent());

                ApiRegistration apiRegistration;
                if (existingApiRegistrationOptional.isPresent()) {
                    logger.debug("Existing registration {}", existingApiRegistrationOptional.get().getId());
                    apiRegistration= existingApiRegistrationOptional.get();
                    apiRegistration.set_lastModified(new Date());
                } else {
                    apiRegistration = ApiRegistrationFactory.createApiRegistration(originCatalog.getOrgNo(), apiRegistrationData);
                    logger.debug("Created apiRegistration for orgNo: {}, id: {}", originCatalog.getOrgNo(), apiRegistration.getId());
                }
                logger.debug("saved apiRegistration {}", apiRegistration.getId());
                apiRegistration.setHarvestStatus(HarvestStatus.Success());

                apiRegistration.setFromApiCatalog(true);

                try {
                    OpenAPI openAPI = apiCatClient.convert(apiSpecUrl, "");//empty string is api-spec, unknown what this is.
                    apiRegistrationData.setOpenApi(openAPI);
                } catch (Exception e) {
                    String errorMessage = "Failed while trying to fetch and parse API spec " + apiSpecUrl + " " + e.toString();
                    apiRegistration.setHarvestStatus(HarvestStatus.Error(errorMessage));
                }

                ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);
                apiCatClient.triggerHarvestApiRegistration(savedApiRegistration.getId());
            }

            originCatalog.setHarvestStatus(HarvestStatus.Success());
            apiCatalogRepository.save(originCatalog);

        } catch (Exception e) {
            String errorMessage = "Failed while trying to fetch and parse API Catalog: " + originCatalog.getHarvestSourceUri() + " " + e.toString();
            logger.warn(errorMessage);
            originCatalog.setHarvestStatus(HarvestStatus.Error(errorMessage));
            apiCatalogRepository.save(originCatalog);
        }

    }

    private class HarvestSingleCatalogTask implements QueuedTask {

        HarvestSingleCatalogTask(ApiCatalog catalog) {
            this.catalog=catalog;
        }

        private ApiCatalog catalog;

        @Override
        public void doIt() {
            doHarvestSingleCatalog(catalog);
        }

    }
}
