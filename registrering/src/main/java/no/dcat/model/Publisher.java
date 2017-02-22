package no.dcat.model;

import lombok.Data;
import lombok.ToString;

@Data
@ToString(includeFieldNames = false)
public class Publisher {
    private String uri;
}
