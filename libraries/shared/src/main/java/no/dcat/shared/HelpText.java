package no.dcat.shared;

import java.util.Map;

/**
 * Created by extkkj on 10.10.2017.
 */

public class HelpText {

    private String id;
    private Map<String,String> shortdesc;
    private Map<String,String> description;

    public HelpText(String id,
                    Map<String, String> shortdesc,
                    Map<String, String> description) {
        this.id = id;
        this.shortdesc = shortdesc;
        this.description = description;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getShortdesc() {
        return shortdesc;
    }

    public void setShortdesc(Map<String, String> shortdesc) {
        this.shortdesc = shortdesc;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

}
