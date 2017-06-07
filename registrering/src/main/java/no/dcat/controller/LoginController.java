package no.dcat.controller;

import com.github.ulisesbocchio.spring.boot.security.saml.user.SAMLUserDetails;
import no.dcat.configuration.SpringSecurityContextBean;
import no.dcat.mock.service.AuthorisationService;
import no.dcat.mock.service.FolkeregisteretService;
import no.dcat.model.Catalog;
import no.dcat.model.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class LoginController {

    public static final String D_9 = "\\d{9}";
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
        String ssn = addUserAuthorization(authentication);

        if (ssn != null) {
            User user = new User();
            user.setCatalogs(AuthorisationService.getOrganisations(ssn));
            user.setName(FolkeregisteretService.getName(ssn));

            createCatalogsIfNeeded(user.getCatalogs());

            return new ResponseEntity<>(user, OK);
        }

        return new ResponseEntity<>(FORBIDDEN);

    }

    private String addUserAuthorization(Authentication authentication) {
        String ssn = null;

        SAMLUserDetails userDetails = (SAMLUserDetails) authentication.getPrincipal();
        if (userDetails != null) {
            ssn = userDetails.getAttribute("uid");

            logger.debug("Create authority grants for {}", ssn);

            List<GrantedAuthority> newAuthorityGrants = new ArrayList<GrantedAuthority>(authentication.getAuthorities());

            Map<String,GrantedAuthority> existingCatalogGrants = new HashMap<>();
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                String grant = authority.getAuthority();
                if (grant.matches(D_9)) {
                    existingCatalogGrants.put(grant, authority);
                }
            }

            for (String catalogId : AuthorisationService.getOrganisations(ssn)) {
                logger.debug("Register catalogId {}", catalogId);
                if (!existingCatalogGrants.containsKey(catalogId)) {
                    SimpleGrantedAuthority catalogGrant = new SimpleGrantedAuthority(catalogId);
                    newAuthorityGrants.add(catalogGrant);
                }
            }

            Authentication newAuth = new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
                    authentication.getCredentials(),
                    newAuthorityGrants);

            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }
        return ssn;
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
        String ssn = addUserAuthorization(auth);


            //get logged in username
            String username = auth.getName();

            auth.getAuthorities()
                    .forEach(authority -> {
                                logger.debug("createCatalogIfNotExists {}", authority.getAuthority());
                                createCatalogIfNotExists(authority.getAuthority());
                            }
                    );

            logger.info("Authenticating user: {}", username);
            return new ResponseEntity<>(username, OK);


    //    return new ResponseEntity<>(FORBIDDEN);
    }

    private void createCatalogsIfNeeded(String[] organizations) {
        for (String orgnr : organizations) {

            createCatalogIfNotExists(orgnr);
        }
    }

    private void createCatalogIfNotExists(String orgnr) {
        if (orgnr.matches(D_9)) {
            HttpEntity<Catalog> catalogResponse = catalogController.getCatalog(orgnr);
            if (!((ResponseEntity) catalogResponse).getStatusCode().equals(HttpStatus.OK)) {
                catalogController.createCatalog(new Catalog(orgnr)).getBody();
            }
        } else {
            logger.warn("Cannot create catalog. Organization number not valid number: {}", orgnr);
        }
    }
}
