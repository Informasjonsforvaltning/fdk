package no.dcat.authorization;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by dask on 22.06.2017.
 */
public class NameEntityService {
    private static Map<String, String> userNames = new HashMap<>();
    private static Map<String, String> organizationNames = new HashMap<>();

    public static NameEntityService SINGLETON = new NameEntityService();

    public String getOrganizationName(String organizationId) {
        return organizationNames.get(organizationId);
    }

    public void setOrganizationName(String organizationId, String organizationName) {
        organizationNames.put(organizationId,organizationName);
    }

    public String getUserName(String id) {
        return userNames.get(id);
    }

    public void setUserName(String id, String name) {
        userNames.put(id, name);
    }
}
