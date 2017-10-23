package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.Map;

/**
 * Model class themes:data-theme.
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataTheme implements Serializable {
    private String id;
    private String uri;
    private String code;
    private String pickedDate;
    private String startUse;
    private Map<String, String> title;
    private ConceptSchema conceptSchema;

    private Integer numberOfHits;
}
