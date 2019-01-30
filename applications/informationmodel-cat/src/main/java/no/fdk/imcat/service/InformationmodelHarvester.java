package no.fdk.imcat.service;

import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelFactory;
import no.fdk.imcat.model.InformationModelHarvestSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/*
    Fetch information models and insert or update them in the search index.
 */
@Service
public class InformationmodelHarvester {

    public static final String API_TYPE = "api";
    public static final int RETRY_COUNT_API_RETRIEVAL = 20;

    private static final Logger logger = LoggerFactory.getLogger(InformationmodelHarvester.class);

    private InformationmodelRepository informationmodelRepository;
    private ApiRegistrationsHarvest apiRegistrationsHarvest;

    private InformationModelFactory informationModelFactory;

    @Autowired
    public InformationmodelHarvester(InformationmodelRepository informationmodelRepository, ApiRegistrationsHarvest apiRegistrationsHarvest, InformationModelFactory informationModelFactory) {
        this.informationmodelRepository = informationmodelRepository;
        this.apiRegistrationsHarvest = apiRegistrationsHarvest;
        this.informationModelFactory = informationModelFactory;
    }

    public void harvestAll() {

        logger.debug("Starting harvest of Information Models from our APIs");
        List<InformationModelHarvestSource> modelSources = getAllHarvestSources();

        Date harvestDate = new Date();
        List<String> idsHarvested = new ArrayList<>();

        for (InformationModelHarvestSource source : modelSources) {
            if (source.sourceType == API_TYPE) {
                try {
                    InformationModel model = informationModelFactory.createInformationModel(source, harvestDate);
                    informationmodelRepository.save(model);
                    idsHarvested.add(model.getId());
                } catch (Exception e) {
                    logger.error("Error creating or saving InformationModel for harvestSourceUri={}", source.harvestSourceUri, e);
                }
            }
        }
        List<String> idsToDelete = informationmodelRepository.getAllIdsNotHarvested(idsHarvested);
        informationmodelRepository.deleteByIds(idsToDelete);
    }

    private List<InformationModelHarvestSource> getAllHarvestSources() {
        //At the moment we only harvest our own apis.
        return apiRegistrationsHarvest.getHarvestSources();
    }


}
