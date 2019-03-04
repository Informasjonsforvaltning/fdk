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
    public static final String ALTINN_TYPE = "altinn";
    public static final int RETRY_COUNT_API_RETRIEVAL = 20;

    private static final Logger logger = LoggerFactory.getLogger(InformationmodelHarvester.class);

    private InformationmodelRepository informationmodelRepository;
    private ApiRegistrationsHarvest apiRegistrationsHarvest;
    private AltinnHarvest altinnHarvest;

    private InformationModelFactory informationModelFactory;

    @Autowired
    public InformationmodelHarvester(InformationmodelRepository informationmodelRepository, ApiRegistrationsHarvest apiRegistrationsHarvest, InformationModelFactory informationModelFactory, AltinnHarvest altinnHarvest) {
        this.informationmodelRepository = informationmodelRepository;
        this.apiRegistrationsHarvest = apiRegistrationsHarvest;
        this.informationModelFactory = informationModelFactory;
        this.altinnHarvest = altinnHarvest;
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
            } else if (source.sourceType == ALTINN_TYPE) {
                InformationModel model = altinnHarvest.getByServiceCodeAndEdition(source.serviceCode, source.serviceEditionCode);
                model = informationModelFactory.enrichInformationModelFromAltInn(model, harvestDate);

                if (model != null) {
                    informationmodelRepository.save(model);
                    idsHarvested.add(model.getId());
                }
            }
        }
        List<String> idsToDelete = informationmodelRepository.getAllIdsNotHarvested(idsHarvested);
        informationmodelRepository.deleteByIds(idsToDelete);
    }

    private List<InformationModelHarvestSource> getAllHarvestSources() {
        ArrayList<InformationModelHarvestSource> sources = new ArrayList<>();
        sources.addAll(altinnHarvest.getHarvestSources());
        sources.addAll(apiRegistrationsHarvest.getHarvestSources());
        return sources;
    }
}
