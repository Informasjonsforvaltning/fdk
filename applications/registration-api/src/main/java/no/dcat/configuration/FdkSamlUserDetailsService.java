package no.dcat.configuration;

import no.dcat.authorization.AuthorizationService;
import no.dcat.authorization.AuthorizationServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

import static no.dcat.configuration.Roles.ROLE_USER;

@Service
public class FdkSamlUserDetailsService implements SAMLUserDetailsService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    AuthorizationService authorizationService;

    @Override
    public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {

        Set<GrantedAuthority> authorities = new HashSet<>();
        String ssn = credential.getAttributeAsString("uid");
        if (ssn == null) {
            throw new UsernameNotFoundException("Invalid user");
        }
        try {
            authorizationService.getOrganisations(ssn)
                    .stream()
                    .map(SimpleGrantedAuthority::new)
                    .forEach(authorities::add);

        } catch (AuthorizationServiceException | RuntimeException e) {
            logger.error("Feil ved autorisasjon i Altinn {}", e);
        } finally {
            authorities.add(new SimpleGrantedAuthority(ROLE_USER));
        }
        return new FdkSamlUserDetails(credential, authorities);
    }
}
