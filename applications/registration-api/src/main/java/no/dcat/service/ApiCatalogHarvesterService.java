package no.dcat.service;

import no.dcat.model.ApiCatalog;
import no.dcat.model.ApiRegistration;
import no.dcat.model.ApiRegistrationFactory;
import no.dcat.model.HarvestStatus;
import no.fdk.acat.bindings.ApiCatBindings;
import no.fdk.harvestqueue.HarvestQueue;
import no.fdk.harvestqueue.QueuedTask;
import no.fdk.imcat.bindings.InformationmodelCatBindings;
import org.apache.commons.io.input.BOMInputStream;
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
import java.io.IOException;
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

    private ApiCatBindings apiCat;

    private InformationmodelCatBindings informationmodelCat;

    private HarvestQueue harvestQueue;

    private ApiRegistrationFactory apiRegistrationFactory;

    @Autowired
    public ApiCatalogHarvesterService(
        ApiRegistrationRepository apiRegistrationRepository,
        ApiCatalogRepository apiCatalogRepository,
        HarvestQueue harvestQueue,
        ApiCatService apiCatService,
        InformationmodelCatService informationmodelCatService,
        ApiRegistrationFactory apiRegistrationFactory
    ) {
        this.apiRegistrationRepository = apiRegistrationRepository;
        this.apiCatalogRepository = apiCatalogRepository;
        this.harvestQueue = harvestQueue;
        this.apiCat = apiCatService;
        this.informationmodelCat = informationmodelCatService;
        this.apiRegistrationFactory = apiRegistrationFactory;
    }

    //TODO: Also trigger this every 24h ? (there exists a spring thing to do that)
    @PostConstruct
    public void initQueue() {

        //Get all the catalogs
        List<ApiCatalog> allApiCatalogs = apiCatalogRepository.findAll().getContent();

        //Add them to the queue
        for (ApiCatalog catalog : allApiCatalogs) {
            addHarvestSingleCatalogTaskToQueue(catalog);
        }
    }

    public void addHarvestSingleCatalogTaskToQueue(ApiCatalog catalog) {
        QueuedTask task = new HarvestSingleCatalogTask(catalog);
        harvestQueue.addTask(task);
    }

    protected void doHarvestSingleCatalog(ApiCatalog originCatalog) {
        logger.info("HarvestSingleCatalog called. Catalog: " + originCatalog);
        BOMInputStream reader = null;
        try {

            URL catalogUrl = new URL(originCatalog.getHarvestSourceUri());
            reader = new BOMInputStream(catalogUrl.openStream());

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
            List<String> errorLog = new ArrayList<>();
            boolean harvestedAtLeastOneAPI=false;

            for (String apiSpecUrl : allApiUrlsForThisCatalog) {
                Optional<ApiRegistration> existingApiRegistrationOptional = apiRegistrationRepository.getByCatalogIdAndApiSpecUrl(originCatalog.getOrgNo(), apiSpecUrl);
                logger.debug("Found existing {}", existingApiRegistrationOptional.isPresent());

                ApiRegistration apiRegistration;
                if (existingApiRegistrationOptional.isPresent()) {
                    logger.debug("Existing registration {} url {}", existingApiRegistrationOptional.get().getId(),apiSpecUrl);
                    apiRegistration = existingApiRegistrationOptional.get();
                } else {
                    apiRegistration = apiRegistrationFactory.createApiRegistration(originCatalog.getOrgNo());
                    logger.debug("Created apiRegistration for orgNo: {}, id: {}", originCatalog.getOrgNo(), apiRegistration.getId());
                }

                apiRegistration.setFromApiCatalog(true);

                try {
                    apiRegistrationFactory.setApiSpecificationFromSpecUrl(apiRegistration, apiSpecUrl);
                    apiRegistration.setHarvestStatus(HarvestStatus.Success());
                    ApiRegistration savedApiRegistration = apiRegistrationRepository.save(apiRegistration);

                    apiCat.triggerHarvestApiRegistration(savedApiRegistration.getId());
                    informationmodelCat.triggerHarvestApiRegistration(savedApiRegistration.getId());
                    harvestedAtLeastOneAPI = true;
                    logger.debug("saved apiRegistration {}, url {}", apiRegistration.getId(), apiSpecUrl);
                } catch (Exception e) {
                    errorLog.add(apiSpecUrl);
                    logger.debug("Failed while trying to harvest API {} ", apiSpecUrl, e.getMessage());
                    String errorMessage = "Failed while trying to fetch and parse API spec " + apiSpecUrl + " " + e.toString();
                    apiRegistration.setHarvestStatus(HarvestStatus.Error(errorMessage));
                }
            }

            if (!errorLog.isEmpty()) {
                logger.info("Harvest of API catalog {} done, errors present", originCatalog.getHarvestSourceUri());
                if (harvestedAtLeastOneAPI) {
                    originCatalog.setHarvestStatus(HarvestStatus.PartialSuccess(String.join(",", errorLog)));
                } else {
                    originCatalog.setHarvestStatus(HarvestStatus.Error(String.join(",", errorLog)));
                }
            } else {
                logger.info("Harvest of  API catalog {} done, success", originCatalog.getHarvestSourceUri());
                originCatalog.setHarvestStatus(HarvestStatus.Success());
            }
            
            apiCatalogRepository.save(originCatalog);

        } catch (Exception e) {
            String errorMessage = "Failed while trying to fetch and parse API Catalog: " + originCatalog.getHarvestSourceUri() + " " + e.toString();
            logger.warn(errorMessage);
            originCatalog.setHarvestStatus(HarvestStatus.Error(errorMessage));
            apiCatalogRepository.save(originCatalog);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException ioe) {
                    logger.debug("Got exception while closing Harvest Input stream ", ioe);
                }
            }
        }

    }

    private class HarvestSingleCatalogTask implements QueuedTask {

        private ApiCatalog catalog;

        HarvestSingleCatalogTask(ApiCatalog catalog) {
            this.catalog = catalog;
        }

        @Override
        public void doIt() {
            doHarvestSingleCatalog(catalog);
        }

    }
}
