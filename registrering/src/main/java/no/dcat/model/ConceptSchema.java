package no.dcat.model;

import lombok.Data;
import lombok.ToString;

/**
 * Created by bjg on 24.02.2017.
 * Models the part of the DataTheme class called conceptSchema.
 */
@Data
@ToString(includeFieldNames = false)
public class ConceptSchema {
    private String id;
    private String title;
    private String versioninfo;
    private String versionnumber;
}
