package no.fdk.userapi;

public class ResourceRole {
    final static ResourceRole ROOT_ADMIN = new ResourceRole(ResourceType.SYSTEM, "root", Role.ADMIN);
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
        PUBLISHER {
            public String toString() {
                return "publisher";
            }
        },
        SYSTEM {
            public String toString() {
                return "system";
            }
        }
    }

    public enum Role {
        ADMIN {
            public String toString() {
                return "admin";
            }
        },
        READ {
            public String toString() {
                return "read";
            }
        }
    }
}
