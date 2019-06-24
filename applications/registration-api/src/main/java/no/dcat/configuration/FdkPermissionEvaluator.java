package no.dcat.configuration;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;

public class FdkPermissionEvaluator implements PermissionEvaluator {

    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        throw new UnsupportedOperationException("Object permission method not implemented");
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {

        boolean authorized = false;

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals(targetId)) {
                authorized = true;
                break;
            }
        }

        return authorized;
    }
}
