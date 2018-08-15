package no.acat.model.openapi3;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PathItem {
    String summary;
    String description;
    Operation get;
    Operation put;
    Operation post;
    Operation delete;
    Operation options;
    Operation head;
    Operation patch;
    Operation trace;
}
