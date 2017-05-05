package no.dcat.portal.webapp.domain;

import java.util.Map;

/**
 * Model class themes:data-theme.
 */
public class DataTheme {
    private String id;
    private String code;
    private String startUse;
    private Map<String, String> title;
    private ConceptSchema conceptSchema;
    private Integer numberOfHits;

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

    public Integer getNumberOfHits() {
        return numberOfHits;
    }

    public void setNumberOfHits(Integer numberOfHits) {
        this.numberOfHits = numberOfHits;
    }
}
