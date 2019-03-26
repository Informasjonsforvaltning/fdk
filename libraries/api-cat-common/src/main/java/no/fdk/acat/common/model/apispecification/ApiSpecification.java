package no.fdk.acat.common.model.apispecification;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import no.fdk.acat.common.model.apispecification.info.Info;
import no.fdk.acat.common.model.apispecification.paths.PathItem;
import no.fdk.acat.common.model.apispecification.servers.Server;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiSpecification {

    // Fields extracted from OpenApi v3
    private Info info;
    private Map<String, PathItem> paths;
    private ExternalDocumentation externalDocs;
    private List<Server> servers;

    // Below are extensions to OpenApi v3 format
    private Set<String> formats;
}
