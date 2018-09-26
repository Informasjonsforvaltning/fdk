package no.dcat.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.Serializable;

/**
 * Created by dask on 01.06.2017.
 */
public class CatalogPermissionEvaluator implements PermissionEvaluator {
    private static Logger logger = LoggerFactory.getLogger(CatalogPermissionEvaluator.class);

    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        boolean authorized = false;

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals(targetDomainObject)) {
                authorized = true;
                break;
            }
        }

        if (authorized) {
            logger.info("User {} hasPermission to {}", authentication.getName(), targetDomainObject);
            return true;
        } else {
            logger.info("User {} has NOT permission to {}", authentication.getName(), targetDomainObject);
            return false;
        }
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
       // return ((CustomUser) authentication.getPrincipal()).hasPermission(targetId, targetType, permission);
        logger.debug("hasPermission 2");
        return false;

    }

}
