package no.dcat.controller;

import no.dcat.config.FdkSamlUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by dask on 22.06.2017.
 */
@Controller
public class LogoutController {
    private static Logger logger = LoggerFactory.getLogger(LogoutController.class);

    @CrossOrigin
    @RequestMapping(value = "/logout", method = GET)
    public String logout(Authentication auth) {
        logger.debug("[LogoutController]: handling request /logout");
        if (auth.getPrincipal() instanceof FdkSamlUserDetails) {
            logger.debug("[LogoutController]: forwarding to /saml/logout");
            return "forward:/saml/logout";
        } else {
            logger.debug("[LogoutController]: forwarding to /loggetut");
            return "forward:/loggetut";
        }
    }
}
