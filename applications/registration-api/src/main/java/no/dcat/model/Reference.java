package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reference {
    SkosCode referenceType;
    String  source; //string with dataset id

    public Reference(SkosCode referenceType, String source) {
        this.referenceType = referenceType;
        this.source = source;
    }
}
