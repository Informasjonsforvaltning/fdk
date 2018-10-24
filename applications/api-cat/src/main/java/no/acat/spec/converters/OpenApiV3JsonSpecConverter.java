package no.acat.spec.converters;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.OpenAPIV3Parser;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import no.acat.config.Utils;
import no.acat.spec.ParseException;

import java.io.IOException;

public class OpenApiV3JsonSpecConverter {

    public static boolean canConvert(String spec) {
        ObjectMapper mapper = Utils.jsonMapper();
        try {
            JsonNode rootNode = mapper.readTree(spec);

            String version = rootNode.path("openapi").asText();
            return version.length() > 2 && version.substring(0, 2).equals("3.");
        } catch (IOException e) {
            return false;
        }
    }

    public static OpenAPI convert(String spec) throws ParseException {
        try {
            SwaggerParseResult swaggerParseResult = new OpenAPIV3Parser().readContents(spec, null, null);

            if (swaggerParseResult.getOpenAPI() == null && (swaggerParseResult.getMessages().size() > 0)) {
                throw new ParseException("Failed to parse document. Messages: " + String.join(" ", swaggerParseResult.getMessages()));
            }
            return swaggerParseResult.getOpenAPI();
        } catch (Error e) {
            throw new ParseException("Cannot import spec as OpenApi v3 json: " + e.getMessage());
        }
    }
}
