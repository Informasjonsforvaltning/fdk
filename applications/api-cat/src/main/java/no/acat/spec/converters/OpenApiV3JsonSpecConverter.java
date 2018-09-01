package no.acat.spec.converters;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import no.acat.config.Utils;

import java.io.IOException;

public class OpenApiV3JsonSpecConverter {
    public static OpenAPI convert(String spec) {
        ObjectMapper mapper = Utils.jsonMapper();
        try {
            return mapper.readValue(spec, OpenAPI.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Cannot import spec as OpenApi v3 json", e);
        }
    }
}
