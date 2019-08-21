package no.dcat.authorization;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by dask on 22.06.2017.
 */
@Service
public class EntityNameService {
    private Map<String, String> userNames = new HashMap<>();

    public String getUserName(String id) {
        return userNames.get(id);
    }

    public void setUserName(String id, String name) {
        userNames.put(id, name);
    }
}
