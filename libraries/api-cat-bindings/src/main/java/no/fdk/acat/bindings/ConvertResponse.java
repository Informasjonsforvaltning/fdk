package no.fdk.acat.bindings;

import io.swagger.v3.oas.models.OpenAPI;
import lombok.Data;

import java.util.List;

@Data
public class ConvertResponse {

    OpenAPI openApi;

    List<String> messages;
}
