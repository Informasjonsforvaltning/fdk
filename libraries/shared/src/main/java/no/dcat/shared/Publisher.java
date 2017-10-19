package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Publisher {
    private String uri;
    private String id;
    private String identifier;
    private String name;

    public Publisher(String orgnr) {
        this.id = orgnr;
    }

    public Publisher() {
        // Default constructor needed for frameworks
    }
}
