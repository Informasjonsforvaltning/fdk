package no.dcat.configuration;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;

public class FdkPermissionEvaluator implements PermissionEvaluator {

    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        throw new UnsupportedOperationException("Object permission method not implemented");
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        SimpleGrantedAuthority requiredAuthority = new SimpleGrantedAuthority((String) targetId);

        return authentication.getAuthorities().contains(requiredAuthority);
    }
}
