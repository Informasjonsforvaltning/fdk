package no.dcat.service.permission;

public interface ResourceRole {
    String getResourceType();

    String getResourceId();

    default Boolean matchResource(String resourceType, String resourceId) {
        return this.getResourceType().equals(resourceType) && this.getResourceId().equals(resourceId);
    }

    Boolean matchPermission(String resourceType, String resourceId, String permission);
}
