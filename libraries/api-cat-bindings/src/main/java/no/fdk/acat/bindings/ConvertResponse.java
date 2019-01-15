package no.fdk.acat.bindings;

import io.swagger.v3.oas.models.OpenAPI;
import lombok.Data;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

import java.util.List;

@Data
public class ConvertResponse {

    OpenAPI openApi;

    ApiSpecification apiSpecification;

    List<String> messages;
}
