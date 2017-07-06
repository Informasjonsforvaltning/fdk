package no.dcat.controller;

import no.dcat.authorization.AuthorizationService;
import no.dcat.authorization.NameEntityService;
import no.dcat.authorization.UserNotAuthorizedException;
import no.dcat.config.FdkSamlUserDetails;
import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.model.Catalog;
import no.dcat.model.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.TEXT_HTML_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class LoginController {

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

    private CatalogController catalogController;
    private SpringSecurityContextBean springSecurityContextBean;

    @Autowired
    public LoginController(CatalogController catalogController, SpringSecurityContextBean springSecurityContextBean) {
        this.catalogController = catalogController;
        this.springSecurityContextBean = springSecurityContextBean;
    }


    @CrossOrigin
    @RequestMapping(value = "/innloggetBruker", method = GET)
    HttpEntity<User> getLoggedInUser() {
        Authentication authentication = springSecurityContextBean.getAuthentication();

        User user = new User();

        if (authentication.getPrincipal() instanceof FdkSamlUserDetails) {
            FdkSamlUserDetails userDetails = (FdkSamlUserDetails) authentication.getPrincipal();
            user.setName(NameEntityService.SINGLETON.getUserName(userDetails.getUid()));
        } else {
            user.setName(authentication.getName());
        }

        logger.debug("User " + user.getName() + " authorisations: " + authentication.getAuthorities().toString());

        //if authorities list contains 1 or less autorities
        //then user has not been authorized for any catalogs
        //(There will be one authority with default role ROLE_USER)
        if(authentication.getAuthorities().size() <= 1) {
            //return new ResponseEntity<User>(user, FORBIDDEN);
            //or throw UserNotAuthorisedException?
        }

        List<String> catalogs= authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(catalog -> catalog.matches("\\d{9}"))
                .collect(toList());

        createCatalogsIfNeeded(catalogs);

        return new ResponseEntity<>(user, OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/loginerror", method = GET)
    String getLoginError() throws UserNotAuthorizedException{
        logger.debug("login error");

        Authentication authentication = springSecurityContextBean.getAuthentication();

        User user = new User();

        if (authentication.getPrincipal() instanceof FdkSamlUserDetails) {
            FdkSamlUserDetails userDetails = (FdkSamlUserDetails) authentication.getPrincipal();
            user.setName(NameEntityService.SINGLETON.getUserName(userDetails.getUid()));
        } else {
            user.setName(authentication.getName());
            throw new UserNotAuthorizedException("12345678");
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


    private void createCatalogsIfNeeded(Collection<String> organizations) {
        organizations.forEach(this::createCatalogIfNotExists);
    }

    private Optional<Catalog> createCatalogIfNotExists(String orgnr) {
        if (! orgnr.matches("\\d{9}")) {
            return Optional.empty();
        }

        HttpEntity<Catalog> catalogResponse = catalogController.getCatalog(orgnr);
        if (!((ResponseEntity) catalogResponse).getStatusCode().equals(HttpStatus.OK)) {
            return Optional.of(catalogController.createCatalog(new Catalog(orgnr)).getBody());
        }
        return Optional.empty();
    }


}
