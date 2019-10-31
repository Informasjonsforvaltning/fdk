package no.dcat.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class FdkPermissionEvaluator implements PermissionEvaluator {
    private static final Logger logger = LoggerFactory.getLogger(FdkPermissionEvaluator.class);


    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        throw new UnsupportedOperationException("Object permission method not implemented");
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        List<SimpleGrantedAuthority> requiredAnyOfAuthorities = new ArrayList<>();

        if (ResourceType.PUBLISHER.equals(targetType)) {
            if (PublisherPermission.ADMIN.equals(permission)) {
                requiredAnyOfAuthorities.add(createPublisherRoleAuthority(targetId, PublisherRole.admin));
            }
        }

        logger.debug("Checking authorization: granted={} allowed={} ", authentication.getAuthorities(), requiredAnyOfAuthorities);

        return authentication.getAuthorities().stream().anyMatch(requiredAnyOfAuthorities::contains);
    }

    private SimpleGrantedAuthority createPublisherRoleAuthority(Serializable targetId, PublisherRole publiserhRole) {
        return new SimpleGrantedAuthority("publisher:" + targetId + ":" + publiserhRole.name());
    }

    public enum PublisherRole {
        //smallcase is userd because this represents role field in token
        //        read, //reserved for future
        //        write, //reserved for future
        //        publish, //reserved for future
        admin
    }

    public static class ResourceType {
        public static final String PUBLISHER = "publisher";
//        public static final String SYSTEM="system"; //reserved for future
    }

    public static class PublisherPermission {
        //        public static final String READ="read";
        //        public static final String WRITE="write";
        //        public static final String PUBLISH="publish";
        public static final String ADMIN = "admin";
    }
}
