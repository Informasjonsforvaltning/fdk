package no.fdk.authdemo.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;

public class FdkPermissionEvaluator implements PermissionEvaluator {
    private static Logger logger = LoggerFactory.getLogger(FdkPermissionEvaluator.class);

    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        throw new UnsupportedOperationException();
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        SimpleGrantedAuthority requiredAuthority = new SimpleGrantedAuthority(targetType + ":" + targetId + ":" + permission);

        return authentication.getAuthorities().contains(requiredAuthority);
    }

}
