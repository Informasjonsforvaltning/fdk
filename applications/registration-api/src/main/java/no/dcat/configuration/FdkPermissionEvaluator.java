package no.dcat.configuration;

import lombok.RequiredArgsConstructor;
import no.dcat.service.permission.PermissionService;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
@RequiredArgsConstructor
public class FdkPermissionEvaluator implements PermissionEvaluator {

    private final PermissionService permissionService;

    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        throw new UnsupportedOperationException("Object permission method not implemented");
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        return permissionService.hasPermission(targetType, targetId.toString(), permission.toString());
    }
}
