package no.dcat.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class FdkSamlUserDetailsService implements SAMLUserDetailsService {
    @Override
    public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {
        UserDetails userDetails = new FdkSamlUserDetails(credential);

        return userDetails;
    }
}
