package no.fdk.acat.common.model.apispecification.paths;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import no.fdk.acat.common.model.apispecification.ExternalDocumentation;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Operation {
    private String summary;
    private String description;
    private ExternalDocumentation externalDocs;
}
