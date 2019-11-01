package no.dcat.service.permission;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
final class PublisherResourceRole implements ResourceRole {
    static final String resourceType = "publisher";
    @NonNull
    private String resourceId;

    @NonNull
    private PublisherRole publisherRole;

    public String getResourceType() {
        return resourceType;
    }

    Boolean matchPermission(PublisherPermission permission) {
        if (permission == PublisherPermission.admin) {
            return this.publisherRole == PublisherRole.admin;
        }
        if (permission == PublisherPermission.write) {
            return this.publisherRole == PublisherRole.admin;
        }
        if (permission == PublisherPermission.read) {
            return this.publisherRole == PublisherRole.admin ||
                this.publisherRole == PublisherRole.read;
        }
        return false;
    }

    public Boolean matchPermission(String resourceType, String resourceId, String permission) {
        return matchResource(resourceType, resourceId) && matchPermission(PublisherPermission.valueOf(permission));
    }

    public enum PublisherPermission {
        read,
        write,
        //        publish, //reserved for future
        admin
    }

    public enum PublisherRole {
        //smallcase is used because this represents role field in token
        read,
        //        write, //reserved for future
        //        publish, //reserved for future
        admin
    }

}
