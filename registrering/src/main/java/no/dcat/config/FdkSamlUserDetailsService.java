package no.dcat.config;

import no.dcat.authorization.AuthorizationService;
import no.dcat.authorization.AuthorizationServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class FdkSamlUserDetailsService implements SAMLUserDetailsService {

    @Autowired
    AuthorizationService authorizationService;

    @Override
    public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {

        Set<GrantedAuthority> authorities = new HashSet<>();
        try {

            authorizationService.getOrganisations(credential.getAttributeAsString("uid"))
                    .stream()
                    .map(SimpleGrantedAuthority::new)
                    .forEach(authorities::add);

            if (authorities.size() > 0 ) {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                return new FdkSamlUserDetails(credential, authorities);
            } else {
                throw new UsernameNotFoundException("User not authorized to use this service");
            }

        } catch (AuthorizationServiceException e) {
            throw new UsernameNotFoundException(e.getLocalizedMessage(),e);
        }
    }
}
