package no.fdk.acat.common.model.apispecification;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import no.fdk.acat.common.model.apispecification.info.Info;
import no.fdk.acat.common.model.apispecification.paths.PathItem;

import java.util.Map;
import java.util.Set;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiSpecification {
    private Info info;
    private Map<String, PathItem> paths;
    private ExternalDocumentation externalDocs;

    private Set<String> formats; // not found in OpenAPI 3, added here to support aggregation from other sources.
}
