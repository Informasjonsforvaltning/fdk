package no.dcat.model;

import lombok.Data;
import lombok.ToString;

import java.util.Map;

/**
 * Created by bjg on 24.02.2017.
 * Model class themes:data-theme.
 */
@Data
@ToString(includeFieldNames = false)
public class DataTheme {
    private String id;
    private String code;
    private String startUse;
    private Map<String, String> title;
    private ConceptSchema conceptSchema;
}
