package no.dcat.shared;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.Map;

/**
 * Subject: A concept that has a term (prefLabel/altLabel) and a definition.
 */
@Data
@ToString(includeFieldNames = false)
public class Subject implements Serializable{
    private String uri;
    private Map<String, String> prefLabel;
    private Map<String, String> altLabel;
    private Map<String,String> definition;
    private Map<String,String> note;
    private String source;

    public Subject() {
    }

    public Subject(String uri, Map<String,String> definition, Map<String, String> prefLabel) {
        this.uri = uri;
        this.definition = definition;
        this.prefLabel = prefLabel;
    }

}
