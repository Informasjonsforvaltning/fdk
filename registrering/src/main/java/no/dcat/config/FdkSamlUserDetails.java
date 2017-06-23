package no.dcat.config;

import com.github.ulisesbocchio.spring.boot.security.saml.user.SAMLUserDetails;
import no.dcat.authorization.AuthorizationService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.saml.SAMLCredential;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class FdkSamlUserDetails extends SAMLUserDetails {

    private SAMLCredential samlCredential;

    public FdkSamlUserDetails(SAMLCredential samlCredential) {

        super(samlCredential);
        this.samlCredential = samlCredential;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        AuthorizationService.SINGLETON.getOrganisations(this.samlCredential.getAttributeAsString("uid"))
                .stream()
                .map(SimpleGrantedAuthority::new)
                .forEach(authorities::add);
        return authorities;
    }

    public String getUid() {
        return this.samlCredential.getAttributeAsString("uid");
    }

}
