package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Publisher {
    private String uri;
    private String id;
    private String name;
    private String orgPath;
    private Map<String, String> prefLabel;

    public Publisher(String orgnr) {
        this.id = orgnr;
    }

    public Publisher(String orgnr, String uri) {
        this.id = orgnr;
        this.uri = uri;
    }

    public Publisher() {
        // Default constructor needed for frameworks
    }
}
