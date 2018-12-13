package no.acat.controller;

import no.acat.harvester.HarvestExecutor;
import no.acat.harvester.HarvestQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping(value = "/trigger/harvest")
public class HarvestController {

    private static final Logger logger = LoggerFactory.getLogger(HarvestController.class);
    private HarvestQueue harvestQueue;

    @Autowired
    public HarvestController(HarvestQueue harvestQueue) {
        this.harvestQueue = harvestQueue;
    }

    @RequestMapping(value = "/all", method = RequestMethod.POST, produces = "application/json")
    public void triggerHarvestAll() {
        logger.info("Trigger harvestAll");
        this.harvestQueue.addTask(HarvestExecutor.HARVEST_ALL);
    }

    @RequestMapping(value = "/apiregistration/{apiRegistrationId}", method = RequestMethod.POST, produces = "application/json")
    public void triggerHarvestApiRegistration(@PathVariable String apiRegistrationId) {
        logger.info("Trigger harvestApiRegistration: {}", apiRegistrationId);
        // harvestAll is eventually also harvesting the desired api.
        // actual harvesting of one api is a future optimization
        this.harvestQueue.addTask(HarvestExecutor.HARVEST_ALL);
    }
}
