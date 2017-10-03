package no.dcat.shared;

import java.io.Serializable;
import java.util.Map;

/**
 * Model class codes:<type>.
 */
public class Subject implements Serializable{
    private String uri;
    private Map<String, String> prefLabel;
    private Map<String,String> definition;
    private Map<String,String> note;
    private String source;


    public Map<String,String> getNote() {
        return note;
    }

    public void setNote(Map<String,String> note) {
        this.note = note;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }


    public Subject() {
    }

    public Subject(String uri, Map<String,String> definition, Map<String, String> prefLabel) {
        this.uri = uri;
        this.definition = definition;
        this.prefLabel = prefLabel;
    }

    public String getUri() {
        return uri;
    }

    public Map<String,String> getDefinition() { return definition; }

    public void setDefinition(Map<String,String> definition) { this.definition = definition; }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public Map<String, String> getPrefLabel() {
        return prefLabel;
    }

    public void setPrefLabel(Map<String, String> prefLabel) {
        this.prefLabel = prefLabel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Subject subject = (Subject) o;

        return getUri() != null ? getUri().equals(subject.getUri()) : subject.getUri() == null;
    }

    @Override
    public int hashCode() {
        return getUri() != null ? getUri().hashCode() : 0;
    }

    @Override
    public String toString() {
        return "SkosCode{" +
                "uri='" + uri + '\'' +
                ", prefLabel=" + prefLabel +
                ", definition=" + definition +
                ", note=" + note  +
                ", source=" + source +
                '}';
    }
}
