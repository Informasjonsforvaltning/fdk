package no.acat.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Paths {
    Map<String, PathItem> pathItems;

    @JsonAnySetter
    public void setPathItem(String key, PathItem value) {
        if (pathItems == null) {
            pathItems = new HashMap<>();
        }
        pathItems.put(key, value);
    }

    @JsonAnyGetter
    public Map<String, PathItem> getPathItem() {
        return pathItems;
    }
}
