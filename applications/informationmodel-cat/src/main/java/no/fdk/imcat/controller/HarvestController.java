package no.fdk.imcat.controller;

import no.fdk.imcat.harvester.HarvestExecutor;
import no.fdk.imcat.harvester.HarvestQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/apis/trigger/harvest")
public class HarvestController {

    private static final Logger logger = LoggerFactory.getLogger(HarvestController.class);
    private HarvestQueue harvestQueue;

    @Autowired
    public HarvestController(HarvestQueue harvestQueue) {
        this.harvestQueue = harvestQueue;
    }

    @RequestMapping(value = "/apiregistration/{apiRegistrationId}", method = RequestMethod.POST, produces = "application/json")
    public void triggerHarvestApiRegistration(@PathVariable String apiRegistrationId) {
        logger.info("Trigger harvestApiRegistration: {}", apiRegistrationId);
        this.harvestQueue.addTask(HarvestExecutor.HARVEST_ALL);
    }
}
