package no.dcat.controller;

import no.dcat.authorization.EntityNameService;
import no.dcat.configuration.FdkSamlUserDetails;
import no.dcat.service.SpringSecurityContextService;
import no.dcat.model.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static no.dcat.configuration.Roles.ROLE_USER;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class LoginController {

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

     private SpringSecurityContextService springSecurityContextService;

    private final EntityNameService entityNameService;

    @Autowired
    public LoginController(SpringSecurityContextService springSecurityContextService, EntityNameService entityNameService) {
        this.springSecurityContextService = springSecurityContextService;
        this.entityNameService = entityNameService;
    }


    @RequestMapping(value = "/innloggetBruker", method = GET)
    HttpEntity<User> innloggetBruker() {
        Authentication authentication = springSecurityContextService.getAuthentication();

        User user = new User();

        if (authentication.getPrincipal() instanceof FdkSamlUserDetails) {
            FdkSamlUserDetails userDetails = (FdkSamlUserDetails) authentication.getPrincipal();
            user.setName(entityNameService.getUserName(userDetails.getUid()));
        } else {
            user.setName(entityNameService.getUserName(authentication.getName()));
        }

        logger.info("User {} logged in with authorizations: {}", user.getName(), authentication.getAuthorities().toString());

        if (authentication.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals(ROLE_USER))) {
            return new ResponseEntity<>(user, OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(value = "/loginerror", method = GET)
    String getLoginError() {
        logger.debug("login error");

        Authentication authentication = springSecurityContextService.getAuthentication();

        User user = new User();

        if (authentication.getPrincipal() instanceof FdkSamlUserDetails) {
            FdkSamlUserDetails userDetails = (FdkSamlUserDetails) authentication.getPrincipal();
            user.setName(entityNameService.getUserName(userDetails.getUid()));
        } else {
            user.setName(authentication.getName());
        }

        //temporary code below, to check that correct information about non-authorisation can be detected
        //(it can)

        StringBuilder userinfo = new StringBuilder();

        userinfo.append("Brukernavn: ");
        userinfo.append(user.getName()).append("\n");

        if(authentication.getAuthorities().size() <= 1) {
            userinfo.append("Bruker er ikke autorisert i Altinn");
        } else {
            userinfo.append("Autentiseringer: ").append(authentication.getAuthorities().toString());
        }

        return "Brukerinfo: " + userinfo.toString();
    }

}
