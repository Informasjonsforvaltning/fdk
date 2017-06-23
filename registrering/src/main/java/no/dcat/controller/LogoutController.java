package no.dcat.controller;

import no.dcat.config.FdkSamlUserDetails;
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

    @CrossOrigin
    @RequestMapping(value = "/logout", method = GET)
    public String logout(Authentication auth) {
        if (auth.getPrincipal() instanceof FdkSamlUserDetails) {
            return "forward:/saml/logout";
        } else {
            return "forward:/loggetut";
        }
    }
}
