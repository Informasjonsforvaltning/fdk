package no.acat.model;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.jackson.JsonComponent;

import java.util.List;
import java.util.Map;
@Data
@AllArgsConstructor
@JsonComponent
@NoArgsConstructor
public class ApiSpecification {

    private String openapi = null;
    private Info info = null;
    private ExternalDocumentation externalDocs = null;
    private List<Server> servers = null;
    private List<SecurityRequirement> security = null;
    private List<Tag> tags = null;
    private Paths paths = null;
    private Components components = null;
    private Map<String, Object> extensions = null;
}
