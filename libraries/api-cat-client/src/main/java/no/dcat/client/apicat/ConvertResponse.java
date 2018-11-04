package no.dcat.client.apicat;

import lombok.Data;
import no.dcat.openapi.OpenAPI;

import java.util.List;

@Data
public class ConvertResponse {

    OpenAPI openApi;

    List<String> messages;
}
