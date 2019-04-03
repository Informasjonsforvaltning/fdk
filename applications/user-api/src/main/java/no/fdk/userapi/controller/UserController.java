package no.fdk.userapi.controller;

import com.google.common.collect.ImmutableMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    //TODO requires authorization!
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Map<String, Object> getUserInfo(@PathVariable String id) {
        logger.debug("Request for user {}", id);

        // simulate situation, where admin role gets assigned from Altinn.
        // Currently we only fetch one role association from Altinn
        // and we interpret it as admin in fdk system

        return ImmutableMap.of(
            "id", id,
            "firstName", "First" + id,
            "lastName", "Last" + id,
            "fdk_access", "publisher:123:admin publisher:234:admin");
    }
}
