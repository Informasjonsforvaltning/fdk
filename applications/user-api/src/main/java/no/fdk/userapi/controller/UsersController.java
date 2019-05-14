package no.fdk.userapi.controller;

import no.fdk.altinn.AltinnClient;
import no.fdk.altinn.Organisation;
import no.fdk.altinn.Person;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/users")
public class UsersController {
    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    AltinnClient altinnClient;

    UsersController(AltinnClient altinnClient) {
        this.altinnClient = altinnClient;
    }

    /*
        This endpoint is active user database
        Currently We do not store permanently users, instead we get dynamically the user data and privileges from Altinn.
     */
    //TODO requires authorization!
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public User getUserInfo(@PathVariable String id) {
        logger.debug("Request for user {}", id);

        // simulate situation, where admin role gets assigned from Altinn.
        // Currently we only fetch one role association from Altinn
        // and we interpret it as admin in fdk system

        //todo use webutils notfound exception
        Person altinnPerson = altinnClient.getPerson(id).orElseThrow(() -> new RuntimeException("Not found"));

        List<Organisation> organisations = altinnClient.getOrganisations(id);
        // todo filter orgform or whitelist organisationnumber
        //  includedOrgforms: ADOS,FKF,FYLK,IKS,KF,KIRK,KOMM,ORGL,SF,STAT,SÆR
        //  includedOrgnr: 974760673

        return new User(altinnPerson, organisations);

    }


}
