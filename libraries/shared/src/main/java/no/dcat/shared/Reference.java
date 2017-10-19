package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reference {
    SkosCode referenceType;
    Dataset  source;

    public Reference(SkosCode referenceType, Dataset source) {
        this.referenceType = referenceType;
        this.source = source;
    }
}
