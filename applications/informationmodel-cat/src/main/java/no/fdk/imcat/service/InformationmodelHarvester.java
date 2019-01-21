package no.fdk.imcat.service;

import no.fdk.imcat.model.InformationModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;

/*
    Fetch information models and insert or update them in the search index.
 */
@Service
public class InformationmodelHarvester {

    public static final String API_TYPE = "api";
    public static final int RETRY_COUNT_API_RETRIEVAL = 20;

    private static final Logger logger = LoggerFactory.getLogger(InformationmodelHarvester.class);


    @Value("${application.harvestSourceUri}")
    private String harvestSourceUri;


    private InformationmodelRepository informationmodelRepository;
    private APIHarvest harvest;

    @Autowired
    public InformationmodelHarvester(InformationmodelRepository repo, APIHarvest harvest) {
        this.informationmodelRepository = repo;
        this.harvest = harvest;
    }

    @PostConstruct
    public void harvestFromSource() {

        logger.debug("In postconstruct: Starting harvest from our APIs ");
        List<InformationModelHarvestSource> modelSources = getTheHarvestSources();

        for (InformationModelHarvestSource source : modelSources) {
            if (source.sourceType == API_TYPE) {

                InformationModel newModel = harvest.getInformationModel(source);

                //Check if the model already has a doc.
                informationmodelRepository.save(newModel);
            }
        }
    }

    private List<InformationModelHarvestSource> getTheHarvestSources() {
        //At the moment we only harvest our own apis.
        return harvest.getHarvestSourcesFromAPIs();
    }


}
