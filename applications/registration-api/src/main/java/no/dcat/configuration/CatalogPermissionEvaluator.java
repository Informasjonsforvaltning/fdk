package no.dcat.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;

public class CatalogPermissionEvaluator implements PermissionEvaluator {
    private static Logger logger = LoggerFactory.getLogger(CatalogPermissionEvaluator.class);

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

        if (authorized) {
            logger.info("User {} hasPermission to {}", authentication.getName(), targetId);
            return true;
        } else {
            logger.info("User {} has NOT permission to {}", authentication.getName(), targetId);
            return false;
        }
    }
}
