package no.dcat.controller;

import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.model.Catalog;
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

import java.util.Optional;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

//@RestController
public class LoginController {

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

    private CatalogController catalogController;
    private SpringSecurityContextBean springSecurityContextBean;

    @Autowired
    public LoginController(CatalogController catalogController, SpringSecurityContextBean springSecurityContextBean) {
        this.catalogController = catalogController;
        this.springSecurityContextBean = springSecurityContextBean;
    }

    /**
     * Login method (temporary solution until SAML)
     *
     * @return acknowledgment of success or failure
     */
    @CrossOrigin
    @RequestMapping(value = "/login", method = POST)
    public HttpEntity<String> authenticateAndCreateMissingCatalogs() {
        Authentication auth = springSecurityContextBean.getAuthentication();

        //get logged in username
        String username = auth.getName();

        auth.getAuthorities()
                .forEach(authority -> createCatalogIfNotExists(authority.getAuthority()));

        logger.info("Authenticating user: ");
        return new ResponseEntity<>(username, OK);
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
