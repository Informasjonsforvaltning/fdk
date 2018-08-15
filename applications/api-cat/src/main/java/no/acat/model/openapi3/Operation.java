package no.acat.model.openapi3;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Operation {

    String description;
    Responses responses;

}
