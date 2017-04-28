package no.dcat.validation.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * Created by dask on 24.04.2017.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Property {
    public static final String WARNING = "Warning";
    public static final String VIOLATION = "Violation";
    public static final String OK = "OK";

    String name;
    String rule;
    String severity;
    String message;

    public Property(String name, String rule, String severity, String message) {
        this.name = name;
        this.rule = rule;
        this.severity = severity;
        this.message = message;
    }

    public Property(String name, String rule) {
        this.name = name;
        this.rule = rule;
        this.severity = OK;
    }
}
