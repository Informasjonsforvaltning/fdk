package no.difi.dcat.datastore.domain.dcat;

import java.util.Map;

/**
 * Model class codes:<type>.
 */
public class SkosCode {
    private String code;

    private Map<String, String> title;

    public SkosCode() {
    }

    public SkosCode(String code, Map<String, String> title) {
        this.code = code;
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Map<String, String> getTitle() {
        return title;
    }

    public void setTitle(Map<String, String> title) {
        this.title = title;
    }
}
