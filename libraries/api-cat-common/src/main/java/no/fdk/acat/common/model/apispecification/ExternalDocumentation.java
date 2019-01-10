package no.fdk.acat.common.model.apispecification;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExternalDocumentation {
    private String description;
    private String url;
}
