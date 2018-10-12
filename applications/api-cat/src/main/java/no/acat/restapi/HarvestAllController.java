package no.acat.restapi;

import no.acat.harvester.ApiHarvester;
import no.acat.spec.ParseException;
import no.dcat.client.apicat.ApiCatClient;
import no.dcat.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping(value = "/triggersync")
public class HarvestAllController {

    private static final Logger logger = LoggerFactory.getLogger(HarvestAllController.class);
    @Autowired ApiHarvester apiHarvester;
    private ApiCatClient apiCatClient;

    @RequestMapping(value = "", method = RequestMethod.POST, produces = "application/json")
    public void getApiDocument() throws NotFoundException, ParseException {
      logger.info("Trigger sync");

      apiHarvester.harvestAll();
    }
}
