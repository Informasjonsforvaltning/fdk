package no.difi.dcat.datastore.domain.dcat;

/**
 * Models the part of the DataTheme class called conceptSchema.
 */
public class ConceptSchema {
    private String id;
    private String title;
    private String versioninfo;
    private String versionnumber;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
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
