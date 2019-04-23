package no.fdk.authdemo.controller;

import org.keycloak.KeycloakSecurityContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

@CrossOrigin
@RestController
@RequestMapping(value = "/demoapi")
public class AuthDemoRestController {
    private static final Logger logger = LoggerFactory.getLogger(AuthDemoRestController.class);


    @Autowired
    public AuthDemoRestController() {
    }

    @RequestMapping(value = "/protected", method = RequestMethod.GET)
    public String getApiDocument() {

        return "secretcontent for admin role only";
    }

    @RequestMapping(value = "/sessioninfo", method = RequestMethod.GET)
    public String sessioninfo(Principal principal, HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        KeycloakSecurityContext keycloakSecurityContext =
            (KeycloakSecurityContext) request
                .getAttribute(KeycloakSecurityContext.class.getName());

        String response = "";

        if (null!=authentication) {
            response += "authentication:" + authentication.toString();
        }
        if (null!=principal) {
            response += "principal:" + principal.toString();
        }

        if (null!=keycloakSecurityContext) {
            response += "principal:" + keycloakSecurityContext.toString();
        }


        return response;
    }

    @RequestMapping(value = "/open", method = RequestMethod.GET)
    public String open() {
        return "open";
    }

}
