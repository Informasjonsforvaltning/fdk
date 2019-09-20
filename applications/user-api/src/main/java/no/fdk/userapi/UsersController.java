package no.fdk.userapi;

import no.fdk.altinn.AltinnClient;
import no.fdk.altinn.Person;
import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/users")
public class UsersController {
    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    AltinnClient altinnClient;
    AltinnUserConverter altinnUserConverter;

    UsersController(AltinnClient altinnClient, AltinnUserConverter altinnUserConverter) {
        this.altinnClient = altinnClient;
        this.altinnUserConverter = altinnUserConverter;
    }

    /*
        This endpoint is active user database
        Currently We do not store permanently users, instead we get dynamically the user data and privileges from Altinn.
     */
    //TODO requires authorization!
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public User getUserInfo(@PathVariable String id) throws NotFoundException {
        logger.debug("Request for user {}", id);

        // Currently we only fetch one role association from Altinn
        // and we interpret it as publisher admin role in fdk system

        Person altinnPerson = altinnClient.getPerson(id).orElseThrow(NotFoundException::new);

        return altinnUserConverter.convert(altinnPerson);
    }


}
