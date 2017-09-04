package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

/**
 * Created by bjg on 24.02.2017.
 * Models the part of the DataTheme class called conceptSchema.
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConceptSchema {
    private String id;
    private Map<String, String> title;
    private String versioninfo;
    private String versionnumber;
}
