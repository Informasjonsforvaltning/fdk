package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by bjg on 24.02.2017.
 * Model class to represent code  values
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkosCode {
    private String uri;
    private String code;
    private Map<String, String> prefLabel = new HashMap<>();

    public SkosCode(String uri, String code, Map<String, String> prefLabel) {
        this.uri = uri;
        this.code = code;
        this.prefLabel = prefLabel;
    }

    public SkosCode() {

    }

    @Override
    public String toString() {
        return "SkosCode{" +
                "uri='" + uri + '\'' +
                ", code='" + code + '\'' +
                ", prefLabel=" + prefLabel +
                '}';
    }
}
