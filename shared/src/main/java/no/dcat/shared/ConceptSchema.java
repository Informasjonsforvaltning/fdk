package no.dcat.shared;

import java.io.Serializable;
import java.util.Map;

/**
 * Models the part of the DataTheme class called conceptSchema.
 */
public class ConceptSchema implements Serializable {
    private String id;
    private Map<String, String> title;
    private String versioninfo;
    private String versionnumber;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getTitle() {
        return title;
    }

    public void setTitle(Map<String, String> title) {
        this.title = title;
    }

    public String getVersioninfo() {
        return versioninfo;
    }

    public void setVersioninfo(String versioninfo) {
        this.versioninfo = versioninfo;
    }

    public String getVersionnumber() {
        return versionnumber;
    }

    public void setVersionnumber(String versionnumber) {
        this.versionnumber = versionnumber;
    }
}
