package no.fdk.userapi;

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

    private AltinnUserService altinnUserService;

    UsersController(AltinnUserService altinnUserService) {
        this.altinnUserService = altinnUserService;
    }

    /*
        This endpoint is active user database
        Currently We do not store permanently users, instead we get dynamically the user data and privileges from Altinn.
     */
    //TODO requires authorization!
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public User getUserInfo(@PathVariable String id) throws NotFoundException {
        logger.debug("Request for user {}", id);

        return altinnUserService.getUser(id).orElseThrow(NotFoundException::new);
    }

}
