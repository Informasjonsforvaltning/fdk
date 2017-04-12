package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

/**
 * Created by bjg on 24.02.2017.
 * Model class to represent code  values
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkosCode {
    private String uri;
    private String code;
    private Map<String, String> prefLabel;

    public SkosCode(String uri, String code, Map<String, String> prefLabel) {
        this.uri = uri;
        this.code = code;
        this.prefLabel = prefLabel;
    }

    public SkosCode(String uri) {
        this.uri = uri;
    }
}
