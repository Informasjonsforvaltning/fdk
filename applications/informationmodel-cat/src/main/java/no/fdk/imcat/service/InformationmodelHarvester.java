package no.fdk.imcat.service;

import no.dcat.shared.HarvestMetadata;
import no.fdk.imcat.model.InformationModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    public void harvestFromSource() {

        logger.debug("Starting harvest of Information Models from our APIs");
        List<InformationModelHarvestSource> modelSources = getTheHarvestSources();

        for (InformationModelHarvestSource source : modelSources) {
            if (source.sourceType == API_TYPE) {

                Optional<InformationModel> model = informationmodelRepository.findById(source.id);

                if (model.isPresent()) {

                    HarvestMetadata harvest = model.get().getHarvest();
                    if (harvest == null) {
                        harvest = new HarvestMetadata();
                    }
                    harvest.setLastHarvested(new Date());
                    model.get().setHarvest(harvest);
                } else {

                    model = Optional.of(harvest.getInformationModel(source));
                    HarvestMetadata harvest = new HarvestMetadata();
                    harvest.setFirstHarvested(new Date());
                    harvest.setLastHarvested(new Date());
                    model.get().setHarvest(harvest);
                }

                informationmodelRepository.save(model.get());
            }
        }
    }

    private List<InformationModelHarvestSource> getTheHarvestSources() {
        //At the moment we only harvest our own apis.
        return harvest.getHarvestSourcesFromAPIs();
    }


}
