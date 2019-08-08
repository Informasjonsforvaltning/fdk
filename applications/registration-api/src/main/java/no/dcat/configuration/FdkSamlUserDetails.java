package no.dcat.configuration;

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
    private Set<GrantedAuthority> authorities;

    public FdkSamlUserDetails(SAMLCredential samlCredential, Set<GrantedAuthority> authorities) {

        super(samlCredential);
        this.authorities = authorities;
        this.samlCredential = samlCredential;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return authorities;
    }

    public String getUid() {
        return this.samlCredential.getAttributeAsString("uid");
    }

}
