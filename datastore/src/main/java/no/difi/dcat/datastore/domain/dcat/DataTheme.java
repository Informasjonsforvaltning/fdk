package no.difi.dcat.datastore.domain.dcat;

import java.util.Map;

/**
 * Models the DataTheme class.
 */
public class DataTheme {
    private String id;
    private String code;
    private String startUse;
    private Map<String, String> title;
    private ConceptSchema conceptSchema;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStartUse() {
        return startUse;
    }

    public void setStartUse(String startUse) {
        this.startUse = startUse;
    }

    public Map<String, String> getTitle() {
        return title;
    }

    public void setTitle(Map<String, String> title) {
        this.title = title;
    }

    public ConceptSchema getConceptSchema() {
        return conceptSchema;
    }

    public void setConceptSchema(ConceptSchema conceptSchema) {
        this.conceptSchema = conceptSchema;
    }
}
