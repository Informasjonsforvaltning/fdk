package no.fdk.userapi;

import no.fdk.webutils.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/authorities")
public class AuthoritiesController {
    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    @Autowired
    private AltinnUserService altinnUserService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getAuthorities(@PathVariable String id) throws NotFoundException  {
        logger.debug("Authorities request for user {}", id);

        return altinnUserService.getAuthorities(id).orElseThrow(NotFoundException::new);
    }
}
