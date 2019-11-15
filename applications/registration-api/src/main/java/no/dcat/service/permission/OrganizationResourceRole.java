package no.dcat.service.permission;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public final class OrganizationResourceRole implements ResourceRole {
    static final String resourceType = "organization";
    @NonNull
    private String resourceId;

    @NonNull
    private OrganizationRole organizationRole;

    public String getResourceType() {
        return resourceType;
    }

    Boolean matchPermission(OrganizationPermission permission) {
        if (permission == OrganizationPermission.admin) {
            return this.organizationRole == OrganizationRole.admin;
        }
        if (permission == OrganizationPermission.write) {
            return this.organizationRole == OrganizationRole.admin;
        }
        if (permission == OrganizationPermission.read) {
            return this.organizationRole == OrganizationRole.admin ||
                this.organizationRole == OrganizationRole.read;
        }
        return false;
    }

    public Boolean matchPermission(String resourceType, String resourceId, String permission) {
        return matchResource(resourceType, resourceId) && matchPermission(OrganizationPermission.valueOf(permission));
    }

    public enum OrganizationPermission {
        read,
        write,
        //        publish, //reserved for future
        admin
    }

    public enum OrganizationRole {
        //smallcase is used because this represents role field in token
        read,
        //        write, //reserved for future
        //        publish, //reserved for future
        admin
    }

}
