package no.dcat.controller;

import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.model.Catalog;
import no.dcat.model.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.OK;
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
        user.setName(authentication.getName());
        logger.debug("User " + user.getName() + " authorisations: " + authentication.getAuthorities().toString());

        List<String> catalogs= authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(catalog -> catalog.matches("\\d{9}"))
                .collect(toList());

        createCatalogsIfNeeded(catalogs);

        return new ResponseEntity<>(user, OK);
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
