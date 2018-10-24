package no.acat.spec.converters;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.converter.SwaggerConverter;
import no.acat.config.Utils;
import no.acat.spec.ParseException;

import java.io.IOException;

public class SwaggerJsonSpecConverter {
    public static boolean canConvert(String spec) {

        ObjectMapper mapper = Utils.jsonMapper();
        try {
            JsonNode rootNode = mapper.readTree(spec);
            String version = rootNode.path("swagger").asText();
            return version.length() > 2 && version.substring(0, 2).equals("2.");
        } catch (IOException e) {
            return false;
        }
    }

    public static OpenAPI convert(String spec) throws ParseException {
        try {
            return new SwaggerConverter().readContents(spec, null, null).getOpenAPI();
        } catch (Exception e) {
            throw new ParseException("Error parsing spec as Swagger v2 json: " + e.getMessage());
        }
    }
}
