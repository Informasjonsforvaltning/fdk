package no.fdk.keycloak.restuser;

import org.jboss.logging.Logger;
import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.storage.adapter.AbstractUserAdapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RestUserAdapter extends AbstractUserAdapter {
    private static final Logger logger = Logger.getLogger(RestUserAdapter.class);

    //todo fieldMap and attributeMap should come from config
    private static final Map<String, String> fieldMap = new HashMap<String, String>() {{
        put("username", "id");
        put("firstName", "firstName");
        put("lastName", "lastName");
    }};
    private static final Map<String, String> attributeMap = new HashMap<String, String>() {{
        put("authorities", "authorities");
    }};
    protected Map<String, String> userData;

    public RestUserAdapter(KeycloakSession session, RealmModel realm, ComponentModel model, Map<String, String> userData) {
        super(session, realm, model);
        logger.info("user adapter constructor, userdata" + userData.toString());
        this.userData = userData;
    }

    @Override
    public String getUsername() {
        return userData.get(fieldMap.get("username"));
    }

    @Override
    public String getFirstName() {
        return userData.get(fieldMap.get("firstName"));
    }

    @Override
    public String getLastName() {
        return userData.get(fieldMap.get("lastName"));
    }

    @Override
    public String getFirstAttribute(String name) {
        String attributeFieldName = attributeMap.get(name);

        return userData.get(attributeFieldName);
    }

    @Override
    public Map<String, List<String>> getAttributes() {
        MultivaluedHashMap<String, String> all = new MultivaluedHashMap<>();
        for (String field : attributeMap.keySet()) {
            String value = userData.get(attributeMap.get(field));
            if (value != null) {
                all.add(field, value);
            }
        }
        return all;
    }

    @Override
    public List<String> getAttribute(String name) {
        String value = userData.get(attributeMap.get(name));

        List<String> list = new ArrayList<>();
        if (value != null) {
            list.add(value);
        }
        return list;

    }
}
