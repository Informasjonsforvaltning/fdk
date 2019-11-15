package no.dcat.service.permission;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static no.dcat.service.permission.OrganizationResourceRole.OrganizationPermission;

@Service
public class PermissionService {
    private static final Logger logger = LoggerFactory.getLogger(PermissionService.class);

    public boolean hasPermission(String targetType, String targetId, String permission) {
        logger.debug("Checking permission: Granted role={}, checking permission={},{},{} ", getAuthentication().getAuthorities(), targetType, targetId, permission);
        return getResourceRoles().stream()
            .anyMatch(rr -> rr.matchPermission(targetType, targetId, permission));
    }

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private Collection<ResourceRole> getResourceRoles() {
        return getAuthentication().getAuthorities().stream()
            .map(Object::toString)
            .map(ResourceRoleFactory::deserialize)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private <T extends ResourceRole> Collection<T> getRolesByType(Class<T> clazz) {
        return this.getResourceRoles().stream()
            .filter(clazz::isInstance)
            .map(clazz::cast)
            .collect(Collectors.toList());
    }

    public Set<String> getOrganizationsForPermission(OrganizationPermission organizationPermission) {
        return this.getRolesByType(OrganizationResourceRole.class).stream()
            .filter(r -> r.matchPermission(organizationPermission))
            .map(OrganizationResourceRole::getResourceId)
            .collect(Collectors.toSet());
    }

}
