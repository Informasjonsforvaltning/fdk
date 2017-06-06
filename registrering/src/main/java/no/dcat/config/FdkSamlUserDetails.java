package no.dcat.config;

import com.github.ulisesbocchio.spring.boot.security.saml.user.SAMLUserDetails;
import no.dcat.mock.service.AuthorisationService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.saml.SAMLCredential;

import java.util.Arrays;
import java.util.Collection;

public class FdkSamlUserDetails extends SAMLUserDetails {

    private SAMLCredential samlCredential;

    public FdkSamlUserDetails(SAMLCredential samlCredential) {

        super(samlCredential);
        this.samlCredential = samlCredential;
    }

    /*
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        GrantedAuthority authority = new SimpleGrantedAuthority(AuthorisationService.getOrganisation(this.samlCredential.getAttributeAsString("uid")));
        return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"), authority);
    }*/

}
