package no.fdk.userapi;

public class ResourceRole {
    final static ResourceRole ROOT_ADMIN = new ResourceRole(ResourceType.system, "root", Role.admin);
    private ResourceType resourceType;
    private String resourceId;
    private Role role;

    ResourceRole(ResourceType resourceType,
                 String resourceId,
                 Role role) {
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.role = role;
    }

    public String toString() {
        return this.resourceType + ":" + this.resourceId + ":" + this.role;
    }

    public enum ResourceType {
        system,
        publisher,//phase out
        organization
    }

    public enum Role {
        admin,
        read
    }
}
