package no.dcat.config;

import no.dcat.authorization.AuthorizationService;
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
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        authorizationService.getOrganisations(credential.getAttributeAsString("uid"))
                .stream()
                .map(SimpleGrantedAuthority::new)
                .forEach(authorities::add);

        return  new FdkSamlUserDetails(credential, authorities);

    }
}
