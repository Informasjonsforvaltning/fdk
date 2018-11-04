package no.dcat.openapi;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = OpenAPIDeserializer.class)
public class OpenAPI extends io.swagger.v3.oas.models.OpenAPI {
}
